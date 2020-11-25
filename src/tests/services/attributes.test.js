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
    data.services = []
    data.attributes = []
    data.options = []
    for (let x = 0; x <= 3; x++) {
      data.services.push(ServiceFactory.generate())
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
            name: "${data.services[0].name}"
            code: "${data.services[0].code}"
            description: "${data.services[0].description}"
            shortDescription: "${data.services[0].shortDescription}"
            pricing: ${data.services[0].pricing}
            slug: "${data.services[0].slug}"
            workforceThreshold: ${data.services[0].workforceThreshold}
            tags: "${data.services[0].tags}"
            seoTitle: "${data.services[0].seoTitle}"
            seoKeywords: "${data.services[0].seoKeywords}"
            seoDescription: "${data.services[0].seoDescription}"
            currency: "${data.services[0].currency}"
            image: "${data.services[0].image}"
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
                  _id
                  name
                }
                options {
                  _id
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
        expect(res.body.data.createOneService.record.attributes[0].attribute.name).toStrictEqual(data.attributes[0].name)
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

  it('should not create new attributes, options when using existing ones', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${data.services[1].name}"
            code: "${data.services[1].code}"
            description: "${data.services[1].description}"
            shortDescription: "${data.services[1].shortDescription}"
            pricing: ${data.services[1].pricing}
            slug: "${data.services[1].slug}"
            workforceThreshold: ${data.services[1].workforceThreshold}
            tags: "${data.services[1].tags}"
            seoTitle: "${data.services[1].seoTitle}"
            seoKeywords: "${data.services[1].seoKeywords}"
            seoDescription: "${data.services[1].seoDescription}"
            currency: "${data.services[1].currency}"
            image: "${data.services[1].image}"
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
                  _id
                  name
                }
                options {
                  _id
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
        expect(res.body.data.createOneService.record.attributes[0].attribute._id).toStrictEqual(service.attributes[0].attribute._id)
        expect(res.body.data.createOneService.record.attributes[0].options[0]._id).toStrictEqual(service.attributes[0].options[0]._id)
      })
  })
})
