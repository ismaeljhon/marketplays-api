const expect = require('expect')
const { request } = require('../../utils/test')
const {
  ServiceFactory,
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')

let data = {}
describe('service attributes', () => {
  before(() => {
    data.service = ServiceFactory.generate()
    data.attributes = []
    data.options = []
    for (let x = 0; x <= 3; x++) {
      data.attributes.push(AttributeFactory.generate())
      data.options.push(OptionFactory.generate())
    }
  })

  let service = null
  it('should create a service with attributes with options', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${data.service.name}"
            description: "${data.service.description}"
            shortDescription: "${data.service.shortDescription}"
            pricing: ${data.service.pricing}
            slug: "${data.service.slug}"
            workforceThreshold: ${data.service.workforceThreshold}
            tags: "${data.service.tags}"
            seoTitle: "${data.service.seoTitle}"
            seoKeywords: "${data.service.seoKeywords}"
            seoDescription: "${data.service.seoDescription}"
            currency: "${data.service.currency}"
            image: "${data.service.image}"
            attributes: [
              {
                name: "${data.attributes[0].name}"
                options: [
                  "${data.options[0].name}",
                  "${data.options[1].name}",
                  "${data.options[2].name}"
                ]
              }
            ]
          }) {
            record {
              _id
              name
              attributes {
                _id
                attribute {
                  name
                }
                options {
                  name
                }
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneService.record')
        expect(res.body.data.createOneService.record.attributes).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              attribute: {
                name: data.attributes[0].name
              }
            })
          ])
        )
        expect(res.body.data.createOneService.record.attributes[0].options).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: data.options[0].name
            })
          ])
        )
        service = res.body.data.createOneService.record
      })
  })

  it('should establish the relationships between item attributes and services correctly', () => {
    return request({
      query: `
        query {
          itemAttribute(_id: "${service.attributes[0]._id}") {
            service {
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.itemAttribute')
        expect(res.body.data.itemAttribute.service.name).toStrictEqual(service.name)
      })
  })
})
