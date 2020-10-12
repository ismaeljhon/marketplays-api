const expect = require('expect')
const { request } = require('../../utils/test')

const testUser = {
  fullName: 'John Doe',
  email: 'john@doe.com',
  password: 'test1234'
}

const signup = ({ fullName, email, password }, returnValues = `{
  id
  email
}`) => {
  return request({
    query: `
      mutation {
        signup(
          fullName: "${fullName}",
          email: "${email}",
          password: "${password}"
        ) ${returnValues}
      }
    `
  })
}

describe('auth', () => {
  describe('sign up', () => {
    it('should create a new user', () => {
      return signup(testUser)
        .expect(res => {
          expect(res.body).toHaveProperty('data.signup.id')
          expect(res.body).toHaveProperty('data.signup.email', testUser.email)
        })
        .expect(200)
    })

    it('should not create a new user when a password is missing', () => {
      return signup({
        ...testUser,
        password: null
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
    })

    it('should not create a new user with the same email', () => {
      return signup(testUser)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
    })
  })

  describe('login', () => {
    it('should succesfully login and return a token', () => {
      return request({
        query: `
          mutation {
            login(email:"${testUser.email}", password:"${testUser.password}") {
              user {
                id
              }
              token
              tokenExpiration
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.login.user.id')
          expect(res.body).toHaveProperty('data.login.token')
          expect(res.body).toHaveProperty('data.login.tokenExpiration')
        })
        .expect(200)
    })
  })

  describe('me', () => {
    let loginResponse = null

    before(async () => {
      await request({
        query: `
          mutation {
            login(email:"${testUser.email}", password:"${testUser.password}") {
              user {
                id
              }
              token
              tokenExpiration
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.login.user.id')
          expect(res.body).toHaveProperty('data.login.token')
          expect(res.body).toHaveProperty('data.login.tokenExpiration')

          loginResponse = res.body
        })
        .expect(200)
    })

    it('should not return a profile when not logged in', () => {
      return request({
        query: `
          query me {
            me {
              id
              email
              fullName
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.data.me).toEqual(null)
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
    })

    it('should succesfully return the profile from me', () => {
      const token = loginResponse.data.login.token

      return request({
        query: `
          query me {
            me {
              id
              fullName
              email
            }
          }
        `
      })
        .set('x-token', token)
        .expect(res => {
          expect(res.body).toHaveProperty('data.me.id')
          expect(res.body).toHaveProperty('data.me.email', testUser.email)
          expect(res.body).toHaveProperty('data.me.fullName', testUser.fullName)
        })
        .expect(200)
    })
  })
})
