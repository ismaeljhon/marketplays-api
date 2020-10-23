const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')

describe('signup', () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const fakeUser = {
    fullName: `${firstName} ${lastName}`,
    email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
    password: faker.internet.password(20)
  }

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          signup(record: {
              fullName: "${fakeUser.fullName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}"
          }) {
            record {
              fullName
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.signup.record')
        expect(res.body.data.signup.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('should only create a new user if the email is unique', () => {
    return request({
      query: `
        mutation {
          signup(record: {
              fullName: "${fakeUser.fullName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}"
          }) {
            record {
              fullName
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })
})
