const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')

describe('signup', () => {
  const fakeUser = UserFactory.generate()
  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          signup(record: {
              firstName: "${fakeUser.firstName}"
              lastName: "${fakeUser.lastName}"
              email: "${fakeUser.email}"
              password: "${fakeUser.password}"  
              username: "${fakeUser.username}"
          }) {
            record {
              firstName
              lastName
              email
            }
          }
        }
      `
    })
      .expect((res) => {
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
            firstName: "${fakeUser.firstName}"
            lastName: "${fakeUser.lastName}"
            email: "${fakeUser.email}"
            password: "${fakeUser.password}"    
            username: "${fakeUser.username}"
          }) {
            record {
              firstName
              lastName
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })
})
