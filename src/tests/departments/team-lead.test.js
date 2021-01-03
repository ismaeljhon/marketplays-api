const expect = require('expect')
const { request } = require('../../utils/test')
const User = require('../../models/user')
const { DepartmentFactory, UserFactory } = require('../../utils/factories/')

const fakeDepartment = DepartmentFactory.generate()

describe('department team lead', () => {
  // create dummy users that will be team leads
  let users = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const user = UserFactory.generate()
      users.push(await User.signup(user))
    }
  })
  let departmentId = null
  it('should create a department with a team lead', () => {
    return request({
      query: `
        mutation {
          createOneDepartment(record: {
            name: "${fakeDepartment.name}",
            code: "${fakeDepartment.code}",
            teamLead: "${users[0]._id}"
          }) {
            record {
              _id
              name
              code
              teamLead {
                _id
                firstName
                lastName
                email
              }
            }
          }
        }
      `
    })
      .expect((res) => {
        // check if the user is assigned to the department
        expect(res.body).toHaveProperty('data.createOneDepartment.record')
        expect(
          res.body.data.createOneDepartment.record.teamLead.username
        ).toEqual(users[0].username)
        departmentId = res.body.data.createOneDepartment.record._id
      })
      .expect(200)
  })
  it('should also add the department against the user', () => {
    return request({
      query: `
        query {
          user(_id: "${users[0]._id}") {
            _id
            teamLeadOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
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
      query: `
        mutation {
          updateDepartmentById(
            _id: "${departmentId}",
            record: {
              teamLead: "${users[1]._id}"
            }
          ) {
            record {
              name
              teamLead {
                _id
                firstName
                lastName
              }
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.updateDepartmentById.record')
        expect(
          res.body.data.updateDepartmentById.record.teamLead.username
        ).toEqual(users[1].username)
      })
      .expect(200)
  })
  it('should remove the deparment under the old team lead', () => {
    return request({
      query: `
        query {
          user(_id: "${users[0]._id}") {
            _id
            teamLeadOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
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
