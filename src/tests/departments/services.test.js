const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')
const Service = require('../../models/service')
const { it } = require('faker/lib/locales')

const fakeDepartment = {
  name: faker.lorem.words(3),
  code: faker.random.alphaNumeric(4).toUpperCase(),
  pricing: faker.commerce.price(5, 300)
}

describe('department services', () => {
  let services = []

  // create dummy services
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      services.push(await Service.create({
        name: faker.lorem.words(4),
        pricing: faker.commerce.price(10)
      }))
    }
  })

  let departmentId = null
  it('should create a department with a service', () => {
    return request({
      query: `
        mutation {
          createOneDepartment(record: {
            name: "${fakeDepartment.name}",
            code: "${fakeDepartment.code}",
            pricing: ${fakeDepartment.pricing},
            services: ["${services[0]._id}"]
          }) {
            record {
              name
              services {
                name
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneDepartment.record.services')
        expect(res.body.data.createOneDepartment.record.services).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: services[0].name
            })
          ])
        )
        departmentId = res.body.data.createOneDepartment._id
      })
  })

  it('should also add the department against the service', () => {
    return request({
      query: `
        query {
          service(_id: "${services[0]._id}") {
            name
            department {
              _id
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.department')
        expect(res.body.data.service._id).toStrictEqual(departmentId)
      })
  })
})
