const expect = require('expect')
const { request } = require('../../utils/test')
const { VendorFactory } = require('../../utils/factories')
const { jsonToGraphQLQuery } = require('json-to-graphql-query')

describe('Create Vendor', () => {
  const fakeUser = VendorFactory.generate()

  it('should create a new Vendor', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          SignupVendorUser: {
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
        expect(res.body).toHaveProperty('data.SignupVendorUser.record')
        expect(res.body.data.SignupVendorUser.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('should only create a new Vendor if the email is unique', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          SignupVendorUser: {
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
