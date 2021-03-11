const expect = require('expect')
const { request } = require('../../utils/test')
const User = require('../../models/user')
const { DepartmentFactory, UserFactory } = require('../../utils/factories/')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('department team lead', () => {
  const fakeDepartment = DepartmentFactory.generate()

  // create dummy users that will be team leads
  let users = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const user = UserFactory.generate()
      users.push(await User.SignupUser(user))
    }
  })

  let departmentId = null
  it('should create a department with a team lead', () => {
    const { name, code } = fakeDepartment
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneDepartment: {
            __args: {
              record: {
                name: name,
                code: code,
                teamLead: `${users[0]._id}`
              }
            },
            record: {
              _id: true,
              name: true,
              code: true,
              teamLead: {
                _id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        // check if the user is assigned to the department
        expect(res.body).toHaveProperty('data.createOneDepartment.record')
        expect(res.body.data.createOneDepartment.record.teamLead.firstName).toEqual(users[0].firstName)
        expect(res.body.data.createOneDepartment.record.teamLead.middleName).toEqual(users[0].middleName)
        expect(res.body.data.createOneDepartment.record.teamLead.lastName).toEqual(users[0].lastName)
        departmentId = res.body.data.createOneDepartment.record._id
      })
      .expect(200)
  })
  it('should also add the department against the user', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          user: {
            __args: {
              _id: `${users[0]._id}`
            },
            _id: true,
            teamLeadOf: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.user.teamLeadOf')
        expect(res.body.data.user.teamLeadOf).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: departmentId
            })
          ])
        )
      })
  })
  it('should update team lead', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          updateDepartmentById: {
            __args: {
              _id: `${departmentId}`,
              record: {
                teamLead: `${users[1]._id}`
              }
            },
            record: {
              name: true,
              teamLead: {
                _id: true,
                firstName: true,
                middleName: true,
                lastName: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.updateDepartmentById.record')
        expect(res.body.data.updateDepartmentById.record.teamLead.firstName).toEqual(users[1].firstName)
        expect(res.body.data.updateDepartmentById.record.teamLead.middleName).toEqual(users[1].middleName)
        expect(res.body.data.updateDepartmentById.record.teamLead.lastName).toEqual(users[1].lastName)
      })
      .expect(200)
  })
  it('should remove the deparment under the old team lead', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          user: {
            __args: {
              _id: `${users[0]._id}`
            },
            _id: true,
            teamLeadOf: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.user.teamLeadOf')
        expect(res.body.data.user.teamLeadOf).toEqual(
          expect.not.arrayContaining([
            expect.not.objectContaining({
              _id: departmentId
            })
          ])
        )
      })
  })
})
