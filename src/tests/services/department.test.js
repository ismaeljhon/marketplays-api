const expect = require('expect')
const { request } = require('../../utils/test')
const { DepartmentFactory, ServiceFactory } = require('../../utils/factories/')
const Department = require('../../models/department')

describe('service department', () => {
  // create dummy service
  let fakeService = ServiceFactory.generate()

  // create dummy departments
  let departments = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const department = DepartmentFactory.generate()
      departments.push(await Department.create(department))
    }
  })

  let service = null
  it('should create a service assigned to a department', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeService.name}"
            code: "${fakeService.code}"
            pricing: ${fakeService.pricing}
            department: "${departments[0]._id}"
          }) {
            record {
              _id
              name
              pricing
              department {
                _id
                name
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.createOneService.record')
      expect(
        res.body.data.createOneService.record.department.name
      ).toStrictEqual(departments[0].name)
      service = res.body.data.createOneService.record
    })
  })

  it('should be added under the department', () => {
    return request({
      query: `
        query {
          department(_id: "${departments[0]._id}") {
            _id
            name
            services {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.department.services')
      expect(res.body.data.department.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: service._id
          })
        ])
      )
    })
  })

  it('should update the department', () => {
    return request({
      query: `
        mutation {
          updateServiceById(
            _id: "${service._id}",
            record: {
              department: "${departments[1]._id}"
            }
          ) {
            record {
              _id
              name
              department {
                _id
                name
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.updateServiceById.record')
      expect(res.body.data.updateServiceById.record.department.name).toEqual(
        departments[1].name
      )
    })
  })

  it('should also delete the service under the old department', () => {
    return request({
      query: `
        query {
          department(_id: "${departments[0]._id}") {
            _id
            services {
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.department')
      expect(res.body.data.department.services).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: service.name
          })
        ])
      )
    })
  })
})
