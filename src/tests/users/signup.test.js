const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')

describe('SignupUser', () => {
  const fakeUser = UserFactory.generate()
  const fakeUser2 = UserFactory.generate()

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              firstName :"${fakeUser.firstName}",
              middleName :"${fakeUser.middleName}",
              lastName: "${fakeUser.lastName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}",
              access : "${fakeUser.access}",
            }) {
            record {
              firstName,
              middleName,
              lastName,
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('should only create a new user if the email is unique', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
            firstName :"${fakeUser.firstName}",
            middleName :"${fakeUser.middleName}",
            lastName: "${fakeUser.lastName}",
            email: "${fakeUser.email}",
            password: "${fakeUser.password}",
            access : "${fakeUser.access}",
          }) {
            record {
              firstName,
              middleName,
              lastName,
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

  it('should create a new user with access Access Type', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
            firstName :"${fakeUser2.firstName}",
            middleName :"${fakeUser2.middleName}",
            lastName: "${fakeUser2.lastName}",
            email: "${fakeUser2.email}",
            password: "${fakeUser2.password}",
            access : "${fakeUser2.access}",
          }) {
            record {
              firstName
              email
              access
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.access).toStrictEqual(fakeUser2.access)
      })
      .expect(200)
  })
})
