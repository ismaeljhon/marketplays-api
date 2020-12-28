const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')
const {
  ServiceFactory,
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')
const Variant = require('../../models/variant')

describe('add/edit variants', () => {
  // generate fake data needed for testing
  let fakeData = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      let data = {}
      data.service = ServiceFactory.generate()
      data.attributes = []
      for (let y = 0; y <= 1; y++) {
        let attribute = {
          attribute: AttributeFactory.generate().name
        }
        attribute.options = []
        for (let z = 0; z <= 2; z++) {
          attribute.options.push(OptionFactory.generate().name)
        }
        data.attributes.push(attribute)
      }

      // generate variants
      data.variants = await Variant.generateMany(data.attributes)
      fakeData.push(data)
    }
  })

  let service = null
  it('should add variants against the service', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[0].service.name}"
            code: "${fakeData[0].service.code}"
            description: "${fakeData[0].service.description}"
            shortDescription: "${fakeData[0].service.shortDescription}"
            pricing: ${fakeData[0].service.pricing}
            slug: "${fakeData[0].service.slug}"
            workforceThreshold: ${fakeData[0].service.workforceThreshold}
            tags: "${fakeData[0].service.tags}"
            seoTitle: "${fakeData[0].service.seoTitle}"
            seoKeywords: "${fakeData[0].service.seoKeywords}"
            seoDescription: "${fakeData[0].service.seoDescription}"
            currency: "${fakeData[0].service.currency}"
            image: "${fakeData[0].service.image}"
            attributes: [
              {
                name: "${fakeData[0].attributes[0].attribute}",
                options: [
                  "${fakeData[0].attributes[0].options[0]}",
                  "${fakeData[0].attributes[0].options[1]}",
                  "${fakeData[0].attributes[0].options[2]}"
                ]
              },
              {
                name: "${fakeData[0].attributes[1].attribute}",
                options: [
                  "${fakeData[0].attributes[1].options[0]}",
                  "${fakeData[0].attributes[1].options[1]}",
                  "${fakeData[0].attributes[1].options[2]}"
                ]
              }              
            ],
            variants: [
              {
                name: "${fakeData[0].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[1].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[1].option.name}"
                  }
                ]
              },
              {
                name: "${fakeData[0].variants[1].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[1].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[1].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[1].attributeData[1].attribute.name}",
                    option: "${fakeData[0].variants[1].attributeData[1].option.name}"
                  }
                ]
              }
            ]
          }) {
            record {
              _id
              name
              variants {
                _id
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
        expect(res.body.data.createOneService.record.variants[0].name).toStrictEqual(fakeData[0].variants[0].name)
        expect(res.body.data.createOneService.record.variants[0].attributeData[0].attribute.name).toStrictEqual(fakeData[0].variants[0].attributeData[0].attribute.name)
        service = res.body.data.createOneService.record
      })
  })
  it('should not create the service if duplicate variants exist', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[0].service.name}"
            code: "${fakeData[0].service.code}"
            description: "${fakeData[0].service.description}"
            shortDescription: "${fakeData[0].service.shortDescription}"
            pricing: ${fakeData[0].service.pricing}
            slug: "${fakeData[0].service.slug}"
            workforceThreshold: ${fakeData[0].service.workforceThreshold}
            tags: "${fakeData[0].service.tags}"
            seoTitle: "${fakeData[0].service.seoTitle}"
            seoKeywords: "${fakeData[0].service.seoKeywords}"
            seoDescription: "${fakeData[0].service.seoDescription}"
            currency: "${fakeData[0].service.currency}"
            image: "${fakeData[0].service.image}"
            attributes: [
              {
                name: "${fakeData[0].attributes[0].attribute}",
                options: [
                  "${fakeData[0].attributes[0].options[0]}",
                  "${fakeData[0].attributes[0].options[1]}",
                  "${fakeData[0].attributes[0].options[2]}"
                ]
              },
              {
                name: "${fakeData[0].attributes[1].attribute}",
                options: [
                  "${fakeData[0].attributes[1].options[0]}",
                  "${fakeData[0].attributes[1].options[1]}",
                  "${fakeData[0].attributes[1].options[2]}"
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[0].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[1].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[1].option.name}"
                  }
                ]
              },
              {
                name: "${fakeData[0].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[1].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[1].option.name}"
                  }
                ]
              },
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
        expect(res.body.data.createOneService).toBeNull()
      })
  })

  it('should not create a service if attributes are not unique', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[0].service.name}"
            code: "${fakeData[0].service.code}"
            description: "${fakeData[0].service.description}"
            shortDescription: "${fakeData[0].service.shortDescription}"
            pricing: ${fakeData[0].service.pricing}
            slug: "${fakeData[0].service.slug}"
            workforceThreshold: ${fakeData[0].service.workforceThreshold}
            tags: "${fakeData[0].service.tags}"
            seoTitle: "${fakeData[0].service.seoTitle}"
            seoKeywords: "${fakeData[0].service.seoKeywords}"
            seoDescription: "${fakeData[0].service.seoDescription}"
            currency: "${fakeData[0].service.currency}"
            image: "${fakeData[0].service.image}"
            attributes: [
              {
                name: "${fakeData[0].attributes[0].attribute}",
                options: [
                  "${fakeData[0].attributes[0].options[0]}",
                  "${fakeData[0].attributes[0].options[1]}",
                  "${fakeData[0].attributes[0].options[2]}"
                ]
              },
              {
                name: "${fakeData[0].attributes[0].attribute}",
                options: [
                  "${fakeData[0].attributes[0].options[0]}",
                  "${fakeData[0].attributes[0].options[1]}",
                  "${fakeData[0].attributes[0].options[2]}"
                ]
              },
            ],
            variants: [
              {
                name: "${fakeData[0].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
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
        expect(res.body.data.createOneService).toBeNull()
      })
  })

  it('should not create a service if options for an attribute are not unique', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[0].service.name}"
            code: "${fakeData[0].service.code}"
            description: "${fakeData[0].service.description}"
            shortDescription: "${fakeData[0].service.shortDescription}"
            pricing: ${fakeData[0].service.pricing}
            slug: "${fakeData[0].service.slug}"
            workforceThreshold: ${fakeData[0].service.workforceThreshold}
            tags: "${fakeData[0].service.tags}"
            seoTitle: "${fakeData[0].service.seoTitle}"
            seoKeywords: "${fakeData[0].service.seoKeywords}"
            seoDescription: "${fakeData[0].service.seoDescription}"
            currency: "${fakeData[0].service.currency}"
            image: "${fakeData[0].service.image}"
            attributes: [
              {
                name: "${fakeData[0].attributes[0].attribute}",
                options: [
                  "${fakeData[0].attributes[0].options[0]}",
                  "${fakeData[0].attributes[0].options[1]}",
                  "${fakeData[0].attributes[0].options[2]}"
                ]
              },
              {
                name: "${fakeData[0].attributes[1].attribute}",
                options: [
                  "${fakeData[0].attributes[1].options[0]}",
                  "${fakeData[0].attributes[1].options[0]}",
                  "${fakeData[0].attributes[1].options[0]}"
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[0].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[1].attribute.name}",
                    option: "${fakeData[0].attributes[1].options[0]}"
                  }
                ]
              },
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
        expect(res.body.data.createOneService).toBeNull()
      })
  })

  it('should relate the service to the variant', () => {
    return request({
      query: `
        query {
          variant(_id: "${service.variants[0]._id}") {
            name
            service {
              name
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.variant')
        expect(res.body.data.variant.service.name).toStrictEqual(service.name)
      })
  })

  it('should edit service attributes and options', () => {
    return request({
      query: `
        mutation {
          updateServiceById(_id: "${service._id}", record: {
            attributes: [
              {
                name: "${fakeData[1].attributes[0].attribute}",
                options: [
                  "${fakeData[1].attributes[0].options[0]}",
                  "${fakeData[1].attributes[0].options[1]}",
                  "${fakeData[1].attributes[0].options[2]}"
                ]
              },
              {
                name: "${fakeData[1].attributes[1].attribute}",
                options: [
                  "${fakeData[1].attributes[1].options[0]}",
                  "${fakeData[1].attributes[1].options[1]}",
                  "${fakeData[1].attributes[1].options[2]}"
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[1].variants[0].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[0].attribute.name}",
                    option: "${fakeData[1].variants[0].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[1].attribute.name}",
                    option: "${fakeData[1].variants[0].attributeData[1].option.name}"
                  }
                ]
              },
              {
                name: "${fakeData[1].variants[1].name}",
                pricing: ${faker.commerce.price()},
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[0].attribute.name}",
                    option: "${fakeData[1].variants[1].attributeData[0].option.name}"
                  },
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[1].attribute.name}",
                    option: "${fakeData[1].variants[1].attributeData[1].option.name}"
                  }
                ]
              }
            ]
          }) {
            record {
              name
              variants {
                _id
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
        expect(res.body).toHaveProperty('data.updateServiceById.record.variants')
        expect(res.body.data.updateServiceById.record.variants[0].name).toStrictEqual(fakeData[1].variants[0].name)
        expect(res.body.data.updateServiceById.record.variants[0].attributeData[0].attribute.name).toStrictEqual(fakeData[1].variants[0].attributeData[0].attribute.name)
      })
  })
})
