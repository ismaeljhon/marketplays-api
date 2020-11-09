const mongoose = require('mongoose')
const { uniq, keyBy, map } = require('lodash')
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
    const Orderline = mongoose.models['Orderline']
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

    // create the order
    let order = await Order.create({
      customer: customer
    })

    // create the orderlines
    const keyedProducts = keyBy(productModels, 'sku')
    let orderlineData = []
    products.forEach(product => {
      orderlineData.push({
        order: order._id,
        item: keyedProducts[product.sku]._id,
        unitPrice: keyedProducts[product.sku].price,
        quantity: product.quantity,
        totalPrice: keyedProducts[product.sku].price * product.quantity
      })
    })
    const orderlines = await Orderline.insertMany(orderlineData)
    order.set('orderlines', orderlines)
    order.save()
    return order
  } catch (error) {
    throw error
  }
}

const Order = generateModel('Order', orderSchema)
module.exports = Order
