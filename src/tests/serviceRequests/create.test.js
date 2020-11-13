const expect = require('expect')
const { request } = require('../../utils/test')
const { map } = require('lodash')
const {
  CustomerFactory,
  SubscriptionTypeFactory,
  ServiceFactory
} = require('../../utils/factories')
const Customer = require('../../models/customer')
const Service = require('../../models/service')
const SubscriptionType = require('../../models/subscriptionType')
const Subscription = require('../../models/subscription')
const Order = require('../../models/order')

describe('service requests', () => {
  let order = []
  let services = []
  let subscription = null
  before(async () => {
    // create a dummy order
    const customer = await Customer.create(CustomerFactory.generate())
    const subscriptionType = await SubscriptionType.create(SubscriptionTypeFactory.generate())
    for (let x = 0; x <= 1; x++) {
      services.push(await Service.create(ServiceFactory.generate()))
    }
    order = await Order.createNew({
      customer: customer._id,
      subscriptions: [
        {
          type: subscriptionType._id,
          services: map(services, '_id')
        }
      ]
    })
    subscription = await Subscription.findOne({
      orderline: order.orderlines[0]
    })
  })

  it('should create service requests per services added to the subscription', () => {
    return request({
      query: `
        query {
          serviceRequests(filter: {
            subscription: "${subscription._id}"
          }) {
            service {
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.serviceRequests')
        expect(res.body.data.serviceRequests).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              service: {
                name: services[0].name
              }
            })
          ])
        )
      })
  })

  it('should retrieve all the service request under a subscription', () => {
    return request({
      query: `
        query {
          subscription(_id: "${subscription._id}") {
            serviceRequests {
              service {
                name
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.subscription.serviceRequests')
        expect(res.body.data.subscription.serviceRequests).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              service: {
                name: services[0].name
              }
            })
          ])
        )
      })
  })
})
