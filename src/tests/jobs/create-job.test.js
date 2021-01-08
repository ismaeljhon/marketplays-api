const expect = require('expect')
const { request } = require('../../utils/test')
const { map } = require('lodash')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')
const {
  CustomerFactory,
  ServiceFactory,
  SubscriptionTypeFactory,
  JobFactory,
  JobCategoryFactory
} = require('../../utils/factories')

const Customer = require('../../models/customer')
const Service = require('../../models/service')
const SubscriptionType = require('../../models/subscriptionType')
const Order = require('../../models/order')
const Orderline = require('../../models/orderline')
const Subscription = require('../../models/subscription')
const JobCategory = require('../../models/jobCategory')

describe('create jobs', () => {
  let data = {}
  let job = JobFactory.generate()
  before(async () => {
    // create dummy customer
    data.customer = await Customer.create(CustomerFactory.generate())

    // create dummy products and services
    data.products = []
    data.services = []
    data.subscriptionTypes = []
    for (let x = 0; x <= 3; x++) {
      data.services.push(await Service.create(ServiceFactory.generate()))
      data.subscriptionTypes.push(await SubscriptionType.create(SubscriptionTypeFactory.generate()))
    }

    // create an order that creates a subscription
    data.order = await Order.createNew({
      customer: data.customer._id,
      subscriptions: [
        {
          type: data.subscriptionTypes[0]._id,
          services: map(data.services, '_id')
        }
      ]
    })
    data.orderlines = await Orderline.find({
      _id: { $in: data.order.orderlines }
    })
    data.subscription = await Subscription.findById(data.orderlines[0].subscription)
    data.jobCategory = await JobCategory.create(JobCategoryFactory.generate())
  })

  let createdJob = null
  it('should create jobs', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneJob: {
            __args: {
              record: {
                ...job,
                category: `${data.jobCategory._id}`,
                serviceRequest: `${data.subscription.serviceRequests[0]}`
              }
            },
            record: {
              _id: true,
              title: true,
              serviceRequest: {
                subscription: {
                  orderline: {
                    order: {
                      orderNumber: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneJob.record.title')
        expect(res.body.data.createOneJob.record.serviceRequest.subscription.orderline.order.orderNumber).toStrictEqual(data.order.orderNumber)
        createdJob = res.body.data.createOneJob.record
      })
  })

  it('should add the job against the service request', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          serviceRequest: {
            __args: {
              _id: `${data.subscription.serviceRequests[0]}`
            },
            _id: true,
            jobs: {
              _id: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.serviceRequest')
        expect(res.body.data.serviceRequest.jobs).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: createdJob._id
            })
          ])
        )
      })
  })

  it('should add the job under the job category', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          jobCategory: {
            __args: {
              _id: `${data.jobCategory._id}`
            },
            name: true,
            jobs: {
              _id: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.jobCategory')
        expect(res.body.data.jobCategory.jobs).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: createdJob._id
            })
          ])
        )
      })
  })
})
