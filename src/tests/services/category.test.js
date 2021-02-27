const expect = require('expect')
const { request } = require('../../utils/test')
const { CategoryFactory, ServiceFactory } = require('../../utils/factories/')
const Category = require('../../models/category')

describe('service category', () => {
  let fakeService = ServiceFactory.generate()

  // create dummy service;
  let categories = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      const category = CategoryFactory.generate()
      categories.push(await Category.create(category))
    }
  })

  let service = null
  it('should create a service assigned to a category', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeService.name}"
            code: "${fakeService.code}"
            pricing: ${fakeService.pricing}
            category: "${categories[0]._id}"
          }) {
            record {
              _id
              name
              pricing
              category {
                _id
                name
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.createOneService.record')
      expect(res.body.data.createOneService.record.category.name).toStrictEqual(
        categories[0].name
      )
      service = res.body.data.createOneService.record
    })
  })

  it('should be added under the category', () => {
    return request({
      query: `
        query {
          category(_id: "${categories[0]._id}") {
            _id
            name
            services {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.category.services')
      expect(res.body.data.category.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: service._id
          })
        ])
      )
    })
  })

  it('should update the category', () => {
    return request({
      query: `
        mutation {
          updateServiceById(
            _id: "${service._id}",
            record: {
              category: "${categories[1]._id}"
            }
          ) {
            record {
              _id
              name
              category {
                _id
                name
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.updateServiceById.record')
      expect(res.body.data.updateServiceById.record.category.name).toEqual(
        categories[1].name
      )
    })
  })

  it('should also delete the service under the old category', () => {
    return request({
      query: `
        query {
          category(_id: "${categories[0]._id}") {
            _id
            services {
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.category')
        expect(res.body.data.category.services).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: service.name
            })
          ])
        )
      })
  })
})
