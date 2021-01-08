const expect = require('expect')
const { request } = require('../../utils/test')
const Service = require('../../models/service')
const { DepartmentFactory, ServiceFactory } = require('../../utils/factories/')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('department services', () => {
  const fakeDepartment = DepartmentFactory.generate()

  // create dummy services
  let services = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const service = ServiceFactory.generate()
      services.push(await Service.create(service))
    }
  })

  let department = null
  it('should create a department with a service', () => {
    const { name, code } = fakeDepartment
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneDepartment: {
            __args: {
              record: {
                name: name,
                code: code,
                services: [ `${services[0]._id}` ]
              }
            },
            record: {
              _id: true,
              name: true,
              services: {
                name: true
              }
            }
          }
        }
      })
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
      query: jsonToGraphQLQuery({
        query: {
          service: {
            __args: {
              _id: `${services[0]._id}`
            },
            name: true,
            department: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.department')
        expect(res.body.data.service.department._id).toStrictEqual(department._id)
      })
  })

  it('should update the department\'s services', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          updateDepartmentById: {
            __args: {
              _id: `${department._id}`,
              record: {
                services: [ `${services[1]._id}` ]
              }
            },
            record: {
              _id: true,
              name: true,
              services: {
                _id: true,
                name: true
              }
            }
          }
        }
      })
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
      query: jsonToGraphQLQuery({
        query: {
          service: {
            __args: {
              _id: `${services[0]._id}`
            },
            _id: true,
            name: true,
            department: {
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.department')
        expect(res.body.data.service.department).toBeNull()
      })
  })
})
