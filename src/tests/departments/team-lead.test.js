const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')
const User = require('../../models/user')

const fakeDepartment = {
  name: faker.lorem.words(3),
  code: faker.random.alphaNumeric(4).toUpperCase(),
  pricing: faker.commerce.price(5, 300)
}

describe('department team lead', () => {
  // create a user that will be the team lead
  let user = null
  before(async () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    user = await User.signup({
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20)
    })
  })

  let departmentId = null
  it('should create a department with a team lead', () => {
    return request({
      query: `
        mutation {
          createOneDepartment(record: {
            name: "${fakeDepartment.name}",
            code: "${fakeDepartment.code}",
            pricing: ${fakeDepartment.pricing},
            teamLead: "${user._id}"
          }) {
            record {
              _id
              name
              code
              teamLead {
                _id
                fullName
                email
              }
            }
          }
        }
      `
    })
      .expect(res => {
        // check if the user is assigned to the department
        expect(res.body).toHaveProperty('data.createOneDepartment.record')
        expect(res.body.data.createOneDepartment.record.teamLead.fullName).toEqual(user.fullName)
        departmentId = res.body.data.createOneDepartment.record._id
      })
      .expect(200)
  })
  it('should also add the department against the user', () => {
    return request({
      query: `
        query {
          user(_id: "${user._id}") {
            _id
            teamLeadOf {
              _id
              name
            }
          }
        }
      `
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
})
