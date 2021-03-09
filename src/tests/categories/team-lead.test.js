const expect = require('expect')
const { request } = require('../../utils/test')
const User = require('../../models/user')
const { CategoryFactory, UserFactory } = require('../../utils/factories/')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('Category team lead', () => {
  const fakeCategory = CategoryFactory.generate()

  // create dummy users that will be team leads
  let users = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const user = UserFactory.generate()
      users.push(await User.SignupUser(user))
    }
  })

  let categoryId = null
  it('should create a category with a team lead', () => {
    const { name, code } = fakeCategory
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneCategory: {
            __args: {
              record: {
                name: name,
                code: code,
                teamLead: `${users[0]._id}`
              }
            },
            record: {
              _id: true,
              name: true,
              code: true,
              teamLead: {
                _id: true,
                firstName: true,
                email: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        // check if the user is assigned to the category
        expect(res.body).toHaveProperty('data.createOneCategory.record')
        expect(res.body.data.createOneCategory.record.teamLead.firstName).toEqual(users[0].firstName)
        categoryId = res.body.data.createOneCategory.record._id
      })
      .expect(200)
  })
  it('should also add the category against the user', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          user: {
            __args: {
              _id: `${users[0]._id}`
            },
            _id: true,
            catTeamLeadOf: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.user.catTeamLeadOf')
        expect(res.body.data.user.catTeamLeadOf).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: categoryId
            })
          ])
        )
      })
  })
})
