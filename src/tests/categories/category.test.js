const expect = require('expect')
const pluralize = require('pluralize')
const { CategoryFactory, ServiceFactory } = require('../../utils/factories/')
const { request } = require('../../utils/test')
const Service = require('../../models/service')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('category pluralize testing', () => {
  it('should pluralize category to categories', () => {
    const name = 'category'
    let directory = pluralize(name.charAt(0).toLowerCase() + name.slice(1))

    expect(directory).toEqual('categories')
  })
})
describe('category services', () => {
  const fakeCategory = CategoryFactory.generate()

  // create dummy services
  let services = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const service = ServiceFactory.generate()
      services.push(await Service.create(service))
    }
  })

  let category = null
  it('should create a category with a service', () => {
    const { name, code } = fakeCategory
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          createOneCategory: {
            __args: {
              record: {
                name: name,
                code: code,
                services: [ `${services[0]._id}` ]
              }
            },
            record: {
              _id: true,
              name: true,
              services: {
                name: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneCategory.record.services')
        expect(res.body.data.createOneCategory.record.services).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: services[0].name
            })
          ])
        )
        category = res.body.data.createOneCategory.record
      })
  })

  it('should also add the category against the service', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          service: {
            __args: {
              _id: `${services[0]._id}`
            },
            name: true,
            category: {
              _id: true,
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.category')
        expect(res.body.data.service.category._id).toStrictEqual(category._id)
      })
  })

  it('should update the categories\'s services', () => {
    return request({
      query: jsonToGraphQLQuery({
        mutation: {
          updateCategoryById: {
            __args: {
              _id: `${category._id}`,
              record: {
                services: [ `${services[1]._id}` ]
              }
            },
            record: {
              _id: true,
              name: true,
              services: {
                _id: true,
                name: true
              }
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.updateCategoryById.record')
        expect(res.body.data.updateCategoryById.record.services).toHaveLength(1)
        expect(res.body.data.updateCategoryById.record.services).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: services[1].name
            })
          ])
        )
      })
  })

  it('should also delete the old category in the service', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          service: {
            __args: {
              _id: `${services[0]._id}`
            },
            _id: true,
            name: true,
            category: {
              name: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.service.category')
        expect(res.body.data.service.category).toBeNull()
      })
  })
})
