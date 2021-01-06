const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')

describe('signup and verification', () => {
  const fakeUser = UserFactory.generate()

  let user = null
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
              verificationCode
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.signup.record')
        expect(res.body.data.signup.record.email).toStrictEqual(fakeUser.email)
        user = res.body.data.signup.record
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

  it('should verify a registered user by providing its verification code', () => {
    return request({
      query: `
        mutation {
          verifyUser(record: {
            code: "${user.verificationCode}"
          }) {
            record {
              email
              emailVerified
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.verifyUser.record')

        // check if the user is verified
        expect(res.body.data.verifyUser.record.emailVerified).toStrictEqual(true)
      })
  })

  it('should reject verification attempt if resulting user is already verified', () => {
    return request({
      query: `
        mutation {
          verifyUser(record: {
            code: "${user.verificationCode}"
          }) {
            record {
              email
              emailVerified
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  it('should reject verification attempt if no user matches with the code', () => {
    return request({
      query: `
        mutation {
          verifyUser(record: {
            code: "somerandomnonexistentcode123"
          }) {
            record {
              email
              emailVerified
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })
})
