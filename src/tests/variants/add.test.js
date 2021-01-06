const expect = require('expect')
const { request } = require('../../utils/test')
const {
  ServiceFactory,
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')
const Variant = require('../../models/variant')

describe('add/edit variants', () => {
  // generate fake data
  let fakeData = {
    service: ServiceFactory.generate(),
    attributes: []
  }
  before(async () => {
    for (let x = 0; x < 2; x++) {
      fakeData.attributes.push(
        {
          attribute: AttributeFactory.generate(),
          options: [0, 1].map(() => {
            return OptionFactory.generate()
          })
        }
      )
    }

    // generate variants based on the generated attribute data
    fakeData.variants = await Variant.generateFromAttributes(fakeData.attributes)
  })

  it('should add variants when creating a service', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData.service.name}",
            code: "${fakeData.service.code}",
            pricing: ${fakeData.service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData.attributes[0].attribute.name}",
                  code: "${fakeData.attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData.attributes[0].options[0].name}",
                    code: "${fakeData.attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData.attributes[0].options[1].name}",
                    code: "${fakeData.attributes[0].options[1].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData.attributes[1].attribute.name}",
                  code: "${fakeData.attributes[1].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData.attributes[1].options[0].name}",
                    code: "${fakeData.attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData.attributes[1].options[1].name}",
                    code: "${fakeData.attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData.variants[0].name}",
                code: "${fakeData.variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "${fakeData.variants[0].attributeData[0].attribute.code}",
                    option: "${fakeData.variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData.variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData.variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData.variants[1].name}",
                code: "${fakeData.variants[1].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData.variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData.variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData.variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData.variants[1].attributeData[1].option.code}",
                  }
                ]
              }
            ]
          }) {
            record {
              _id
              name
              attributes {
                attribute {
                  name
                  code
                }
                options {
                  name
                  code
                }
              }
              variants {
                _id
                name
                code
                attributeData {
                  attribute {
                    name
                    code
                  }
                  option {
                    name
                    code
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
        const variants = res.body.data.createOneService.record.variants

        // check if variants have been correctly assigned
        expect(variants[0].name)
          .toStrictEqual(fakeData.variants[0].name)
        expect(variants[0].attributeData[0].attribute.name)
          .toStrictEqual(fakeData.variants[0].attributeData[0].attribute.name)
      })
  })

  // @TODO - test adding attributes with duplicate attribute codes
  // @TODO - test adding attributes with duplicate option codes
  // @TODO - test adding variants with duplicate variant codes
  // @TODO - test adding variants with invalid attribute data
  // @TODO - when variant validation fails, all created item attributes must be deleted
})
