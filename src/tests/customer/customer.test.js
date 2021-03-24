const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')
const { jsonToGraphQLQuery } = require('json-to-graphql-query')

describe('Create Customer', () => {
  const fakeUser = UserFactory.generate()

  it('should create a new Customer', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          SignupCustomerUser: {
            __args: {
              record: {
                ...fakeUser
              }
            },
            record: {
              _id: true,
              email: true
            }
          }
        }
      })

    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupCustomerUser.record')
        expect(res.body.data.SignupCustomerUser.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('should only create a new Customer if the email is unique', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          SignupCustomerUser: {
            __args: {
              record: {
                ...fakeUser
              }
            },
            record: {
              _id: true,
              email: true
            }
          }
        }
      })

    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })
})
