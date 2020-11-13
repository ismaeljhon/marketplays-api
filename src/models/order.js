const mongoose = require('mongoose')
const { union, uniq, keyBy, map, sum, groupBy, keys } = require('lodash')
const { UserInputError } = require('apollo-server-express')
const orderSchema = require('../schemas/order')
const generateModel = require('../utils/generate-model')

orderSchema.statics.createNew = async ({
  customer,
  products = [],
  subscriptions = []
}) => {
  try {
    // make sure order is for a valid customer
    const Customer = mongoose.models['Customer']
    const Product = mongoose.models['Product']
    const Service = mongoose.models['Service']
    const SubscriptionType = mongoose.models['SubscriptionType']
    const Subscription = mongoose.models['Subscription']
    const Order = mongoose.models['Order']
    const Orderline = mongoose.models['Orderline']
    const ServiceRequest = mongoose.models['ServiceRequest']
    const existingCustomer = await Customer.findById(customer)
    if (!existingCustomer) {
      throw new UserInputError('Customer does not exist')
    }

    // make sure at least one of either products or subscriptions
    // are being purchased
    if (products.length <= 0 && subscriptions.length <= 0) {
      throw new UserInputError('No items added')
    }

    // make sure all of the products or services being purcahsed are valid
    let productSkus = uniq(map(products, 'sku'))
    const productModels = await Product.find({
      'sku': { $in: productSkus }
    })
    if (productSkus.length !== productModels.length) {
      throw new UserInputError('Items contain invalid product(s)')
    }

    let serviceIds = []
    let subscriptionTypeIds = []
    subscriptions.forEach(subscription => {
      if (subscription.services.length <= 0) {
        throw new UserInputError('A subscription contains no service(s)')
      }

      if (!subscription.type) {
        throw new UserInputError('A subscription has no type')
      }
      serviceIds = union(subscription.services, serviceIds)
      subscriptionTypeIds.push(subscription.type)
    })
    subscriptionTypeIds = uniq(subscriptionTypeIds)
    const services = await Service.find({
      '_id': { $in: serviceIds }
    })
    if (serviceIds.length !== services.length) {
      throw new UserInputError('Items contain invalid service(s)')
    }

    // create the order
    let order = await Order.create({
      customer: customer
    })

    // create the subscriptions first
    const keyedSubscriptionTypes = keyBy(await SubscriptionType.find({
      '_id': { $in: subscriptionTypeIds }
    }), '_id')

    const keyedServices = keyBy(services, '_id')
    let subscriptionData = []
    subscriptions.forEach(subscription => {
      let type = keyedSubscriptionTypes[subscription.type]
      if (!type.policyCompliant(subscription.services)) {
        throw new UserInputError('Subscriptions contain services not compliant with subscription type policy')
      }

      // assuming a service can only be added once per subscription,
      // get the total cost of the subscription
      let totalPrice = 0
      subscription.services.forEach(service => {
        totalPrice += keyedServices[service].pricing
      })
      subscriptionData.push({
        subscriptionType: subscription.type,
        services: subscription.services,
        totalPrice: totalPrice
      })
    })
    const createdSubscriptions = await Subscription.insertMany(subscriptionData)

    /// prepare orderlines, service requests to be created
    let serviceRequestData = []
    let subscriptionOrderlineData = []

    createdSubscriptions.forEach(createdSubscription => {
      createdSubscription.services.forEach(service => {
        serviceRequestData.push({
          subscription: createdSubscription._id,
          service: service
        })
      })

      subscriptionOrderlineData.push({
        order: order._id,
        subscription: createdSubscription._id,
        unitPrice: createdSubscription.totalPrice,
        quantity: 1,
        totalPrice: createdSubscription.totalPrice
      })
    })

    // @TODO - move to subscription post-save hook?
    const createdServiceRequests = await ServiceRequest.insertMany(serviceRequestData)
    const groupedServiceRequests = groupBy(createdServiceRequests, 'subscription')
    keys(groupedServiceRequests).forEach(async key => {
      await Subscription.updateOne(
        { _id: key },
        { $set: { serviceRequests: groupedServiceRequests[key] } }
      )
    })

    // create the orderlines for the subscriptions
    const subscriptionOrderlines = await Orderline.insertMany(subscriptionOrderlineData)

    // update subscriptions to set the orderline reference
    subscriptionOrderlines.forEach(async subscriptionOrderline => {
      await Subscription.updateOne(
        { _id: subscriptionOrderline.subscription },
        { $set: { orderline: subscriptionOrderline._id } }
      )
    })

    let productOrderlineData = []
    const keyedProducts = keyBy(productModels, 'sku')
    products.forEach(product => {
      productOrderlineData.push({
        order: order._id,
        product: keyedProducts[product.sku]._id,
        unitPrice: keyedProducts[product.sku].price,
        quantity: product.quantity,
        totalPrice: keyedProducts[product.sku].price * product.quantity
      })
    })

    // create the orderlines for the products
    const productOrderlines = await Orderline.insertMany(productOrderlineData)
    order.set('orderlines', [
      ...subscriptionOrderlines,
      ...productOrderlines
    ])

    // update total price
    order.totalAmount = sum(map([
      ...subscriptionOrderlines,
      ...productOrderlines
    ], 'totalPrice'))

    order.save()
    return order
  } catch (error) {
    throw error
  }
}

const Order = generateModel('Order', orderSchema)
module.exports = Order
