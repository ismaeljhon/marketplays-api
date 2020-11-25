const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')
const {
  ServiceFactory,
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')
const Variant = require('../../models/variant')

describe('add variants', () => {
  let data = {}
  before(async () => {
    data.service = ServiceFactory.generate()
    data.attributes = []
    for (let x = 0; x <= 1; x++) {
      let attribute = {
        attribute: AttributeFactory.generate().name
      }
      attribute.options = []
      for (let y = 0; y <= 2; y++) {
        attribute.options.push(OptionFactory.generate().name)
      }
      data.attributes.push(attribute)
    }

    // generate variants
    data.variants = await Variant.generateMany(data.attributes)
  })

  it('should add variants against the service', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${data.service.name}"
            code: "${data.service.code}"
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
                name: "${data.attributes[0].attribute}",
                options: [
                  "${data.attributes[0].options[0]}",
                  "${data.attributes[0].options[1]}",
                  "${data.attributes[0].options[2]}"
                ]
              },
              {
                name: "${data.attributes[1].attribute}",
                options: [
                  "${data.attributes[1].options[0]}",
                  "${data.attributes[1].options[1]}",
                  "${data.attributes[1].options[2]}"
                ]
              }              
            ],
            variants: [
              {
                name: "${data.variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${data.variants[0].attributeData[0].attribute.name}",
                    option: "${data.variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${data.variants[0].attributeData[1].attribute.name}",
                    option: "${data.variants[0].attributeData[1].option.name}"
                  }
                ]
              },
              {
                name: "${data.variants[1].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${data.variants[1].attributeData[0].attribute.name}",
                    option: "${data.variants[1].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${data.variants[1].attributeData[1].attribute.name}",
                    option: "${data.variants[1].attributeData[1].option.name}"
                  }
                ]
              }
            ]
          }) {
            record {
              name
              variants {
                name
                attributeData {
                  attribute {
                    name
                  }
                  option {
                    name
                  }
                }
              }
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneService.record.variants')
        expect(res.body.data.createOneService.record.variants[0].name).toStrictEqual(data.variants[0].name)
        expect(res.body.data.createOneService.record.variants[0].attributeData[0].attribute.name).toStrictEqual(data.variants[0].attributeData[0].attribute.name)
      })
  })
  // @TODO - variants should have a unique attributeData combination
  // eg a service cannot have 2 variants of billing cycle: basic
  // @TODO - check if variant is related to the service
})
