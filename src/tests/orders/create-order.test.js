const expect = require('expect')
const { request } = require('../../utils/test')
const {
  CustomerFactory,
  ProductFactory,
  ServiceFactory,
  SubscriptionTypeFactory
} = require('../../utils/factories')
const Customer = require('../../models/customer')
const Product = require('../../models/product')
const Service = require('../../models/service')
const SubscriptionType = require('../../models/subscriptionType')

const data = {}
describe('create an order', () => {
  before(async () => {
    // create dummy customer
    data.customer = await Customer.create(CustomerFactory.generate())

    // create dummy products and services
    data.products = []
    data.services = []
    data.subscriptionTypes = []
    for (let x = 0; x <= 3; x++) {
      data.products.push(await Product.create(ProductFactory.generate()))
      data.services.push(await Service.create(ServiceFactory.generate()))
      data.subscriptionTypes.push(await SubscriptionType.create(SubscriptionTypeFactory.generate()))
    }
  })
  it('should create an order with products as items', () => {
    return request({
      query: `
        mutation {
          createOneOrder(record: {
            customer: "${data.customer._id}",
            products: [
              {
                sku: "${data.products[0].sku}",
                quantity: 4
              },
              {
                sku: "${data.products[1].sku}",
                quantity: 2
              }
            ]
          }) {
            record {
              orderNumber
              created
              orderlines {
                product {
                  sku
                }
                unitPrice
                totalPrice
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneOrder.record.orderlines')
        expect(res.body.data.createOneOrder.record.orderlines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              product: {
                sku: data.products[0].sku
              }
            })
          ])
        )
        expect(res.body.data.createOneOrder.record.orderlines[0].unitPrice).toStrictEqual(data.products[0].price)
        expect(res.body.data.createOneOrder.record.orderlines[0].totalPrice).toStrictEqual(data.products[0].price * 4)
      })
      .expect(200)
  })

  it('should create an order with subscriptions as items', () => {
    return request({
      query: `
        mutation {
          createOneOrder(record: {
            customer: "${data.customer._id}",
            subscriptions: [
              {
                type: "${data.subscriptionTypes[0]._id}",
                services: [
                  "${data.services[0]._id}",
                  "${data.services[1]._id}",
                ]
              },
              {
                type: "${data.subscriptionTypes[1]._id}",
                services: [
                  "${data.services[1]._id}",
                  "${data.services[0]._id}",
                ]
              }
            ]
          }) {
            record {
              orderNumber
              created
              orderlines {
                subscription {
                  services {
                    name
                  }
                }
                unitPrice
                totalPrice
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneOrder.record.orderlines')
        expect(res.body.data.createOneOrder.record.orderlines[0].subscription.services).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: data.services[0].name
            })
          ])
        )
        expect(res.body.data.createOneOrder.record.orderlines[1].totalPrice).toStrictEqual(data.services[1].pricing + data.services[0].pricing)
      })
  })
})
