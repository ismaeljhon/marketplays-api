const expect = require('expect')
const { request } = require('../../utils/test')
const Service = require('../../models/service')
const { DepartmentFactory, ServiceFactory } = require('../../utils/factories/')

const fakeDepartment = DepartmentFactory.generate()

describe('department services', () => {
  let services = []

  // create dummy services
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const service = ServiceFactory.generate()
      services.push(await Service.create(service))
    }
  })

  let department = null
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
              _id
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
        department = res.body.data.createOneDepartment.record
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
        expect(res.body.data.service.department._id).toStrictEqual(department._id)
      })
  })

  it('should update the department\'s services', () => {
    return request({
      query: `
        mutation {
          updateDepartmentById(
            _id: "${department._id}"
            record: {
              services: ["${services[1]._id}"]
            }
          ) {
            record {
              _id
              name
              services {
                _id
                name
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.updateDepartmentById.record')
        expect(res.body.data.updateDepartmentById.record.services).toHaveLength(1)
        expect(res.body.data.updateDepartmentById.record.services).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: services[1].name
            })
          ])
        )
      })
  })

  it('should also delete the old department in the service', () => {
    return request({
      query: `
        query {
          service(_id: "${services[0]._id}") {
            _id
            name
            department {
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.department')
        expect(res.body.data.service.department).toBeNull()
      })
  })
})
