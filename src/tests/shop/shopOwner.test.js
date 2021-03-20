const expect = require('expect')
const { request } = require('../../utils/test')
const User = require('../../models/user')
const { ShopFactory, UserFactory } = require('../../utils/factories/')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('Shop Owner', () => {
  const shop = ShopFactory.generate()

  // create dummy users that will be team leads
  let users = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const user = UserFactory.generate()
      users.push(await User.SignupUser(user))
    }
  })

  let shopId = null
  it('should create a shop with a user', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneShop: {
            __args: {
              record: {
                ...shop,
                ownBy: `${users[0]._id}`
              }
            },
            record: {
              _id: true,
              name: true,
              ownBy: {
                _id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        // check if the user is owner of shop
        expect(res.body).toHaveProperty('data.createOneShop.record')
        expect(res.body.data.createOneShop.record.ownBy.firstName).toEqual(users[0].firstName)
        expect(res.body.data.createOneShop.record.ownBy.middleName).toEqual(users[0].middleName)
        expect(res.body.data.createOneShop.record.ownBy.lastName).toEqual(users[0].lastName)

        shopId = res.body.data.createOneShop.record._id
      })
      .expect(200)
  })
  it('should also add the shop against the user', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          user: {
            __args: {
              _id: `${users[0]._id}`
            },
            _id: true,
            shops: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.user.shops')
        expect(res.body.data.user.shops).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: shopId
            })
          ])
        )
      })
  })
})
