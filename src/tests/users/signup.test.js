const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')

describe('SignupUser', () => {
  const fakeUser = UserFactory.generate()

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
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

  /* username **
    should be unique
    not null
     */

  /*
    Password **
    should be able to check if password should not be null
    should be strong contains alphanumeric chars;
    confirm password and password should be equal;

  */
})
