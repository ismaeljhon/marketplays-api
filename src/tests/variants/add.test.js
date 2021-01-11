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
  let fakeData = []
  before(async () => {
    for (let x = 0; x < 2; x++) {
      let row = {
        service: ServiceFactory.generate(),
        attributes: []
      }
      for (let y = 0; y < 2; y++) {
        row.attributes.push(
          {
            attribute: AttributeFactory.generate(),
            options: [0, 1].map(() => {
              return OptionFactory.generate()
            })
          }
        )
      }
      // generate variants based on the generated attribute data
      row.variants = await Variant.generateFromAttributes(row.attributes)
      fakeData.push(row)
    }
  })

  it('should add variants when creating a service', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[0].service.name}",
            code: "${fakeData[0].service.code}",
            pricing: ${fakeData[0].service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData[0].attributes[0].attribute.name}",
                  code: "${fakeData[0].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[0].attributes[0].options[0].name}",
                    code: "${fakeData[0].attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData[0].attributes[0].options[1].name}",
                    code: "${fakeData[0].attributes[0].options[1].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData[0].attributes[1].attribute.name}",
                  code: "${fakeData[0].attributes[1].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[0].attributes[1].options[0].name}",
                    code: "${fakeData[0].attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData[0].attributes[1].options[1].name}",
                    code: "${fakeData[0].attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[0].variants[0].name}",
                code: "${fakeData[0].variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[0].attribute.code}",
                    option: "${fakeData[0].variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[0].variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData[0].variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData[0].variants[1].name}",
                code: "${fakeData[0].variants[1].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData[0].variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData[0].variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[0].variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData[0].variants[1].attributeData[1].option.code}",
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
          .toStrictEqual(fakeData[0].variants[0].name)
        expect(variants[0].attributeData[0].attribute.name)
          .toStrictEqual(fakeData[0].variants[0].attributeData[0].attribute.name)
      })
  })

  it('should NOT create the service if attributes have duplicate attribute codes', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[1].service.name}",
            code: "${fakeData[1].service.code}",
            pricing: ${fakeData[1].service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData[1].attributes[0].attribute.name}",
                  code: "${fakeData[1].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[0].options[0].name}",
                    code: "${fakeData[1].attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[0].options[1].name}",
                    code: "${fakeData[1].attributes[0].options[1].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData[1].attributes[1].attribute.name}",
                  code: "${fakeData[1].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[1].options[0].name}",
                    code: "${fakeData[1].attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[1].options[1].name}",
                    code: "${fakeData[1].attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[1].variants[0].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData[1].variants[1].name}",
                code: "${fakeData[1].variants[1].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[1].option.code}",
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  it('should NOT create the serivce if duplicate option codes per attribute exists', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[1].service.name}",
            code: "${fakeData[1].service.code}",
            pricing: ${fakeData[1].service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData[1].attributes[0].attribute.name}",
                  code: "${fakeData[1].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[0].options[0].name}",
                    code: "${fakeData[1].attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[0].options[0].name}",
                    code: "${fakeData[1].attributes[0].options[0].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData[1].attributes[1].attribute.name}",
                  code: "${fakeData[1].attributes[1].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[1].options[0].name}",
                    code: "${fakeData[1].attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[1].options[1].name}",
                    code: "${fakeData[1].attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[1].variants[0].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData[1].variants[1].name}",
                code: "${fakeData[1].variants[1].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[1].option.code}",
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  // test adding variants with duplicate variant codes
  it('should NOT create the serivce if duplicate variant codes exists', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[1].service.name}",
            code: "${fakeData[1].service.code}",
            pricing: ${fakeData[1].service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData[1].attributes[0].attribute.name}",
                  code: "${fakeData[1].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[0].options[0].name}",
                    code: "${fakeData[1].attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[0].options[1].name}",
                    code: "${fakeData[1].attributes[0].options[1].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData[1].attributes[1].attribute.name}",
                  code: "${fakeData[1].attributes[1].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[1].options[0].name}",
                    code: "${fakeData[1].attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[1].options[1].name}",
                    code: "${fakeData[1].attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[1].variants[0].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData[1].variants[1].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[1].option.code}",
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  // @TODO - test adding variants with invalid attribute data
  it('should NOT create the serivce if invalid variant attribute data exists', () => {
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeData[1].service.name}",
            code: "${fakeData[1].service.code}",
            pricing: ${fakeData[1].service.pricing},
            attributes: [
              {
                attribute: {
                  name: "${fakeData[1].attributes[0].attribute.name}",
                  code: "${fakeData[1].attributes[0].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[0].options[0].name}",
                    code: "${fakeData[1].attributes[0].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[0].options[1].name}",
                    code: "${fakeData[1].attributes[0].options[1].code}"
                  }
                ]
              },
              {
                attribute: {
                  name: "${fakeData[1].attributes[1].attribute.name}",
                  code: "${fakeData[1].attributes[1].attribute.code}"
                },
                options: [
                  {
                    name: "${fakeData[1].attributes[1].options[0].name}",
                    code: "${fakeData[1].attributes[1].options[0].code}"
                  },
                  {
                    name: "${fakeData[1].attributes[1].options[1].name}",
                    code: "${fakeData[1].attributes[1].options[1].code}"
                  }
                ]
              }
            ],
            variants: [
              {
                name: "${fakeData[1].variants[0].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 123.45,
                attributeData: [
                  {
                    attribute: "somenonexistentcode123",
                    option: "${fakeData[1].variants[0].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[0].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[0].attributeData[1].option.code}",
                  }
                ]
              },
              {
                name: "${fakeData[1].variants[1].name}",
                code: "${fakeData[1].variants[0].code}",
                pricing: 23.50,
                attributeData: [
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[0].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[0].option.code}",
                  },
                  {
                    attribute: "${fakeData[1].variants[1].attributeData[1].attribute.code}",
                    option: "${fakeData[1].variants[1].attributeData[1].option.code}",
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  // when variant validation fails, all created item attributes must be deleted
  it('should delete any created item attributes when variant creation fails', () => {
    return request({
      query: `
        query {
          countItemAttributes(filter: {
            service: null
          })
        }
      `
    })
      .expect(res => {
        expect(res.body.data).toHaveProperty('countItemAttributes')
        expect(res.body.data.countItemAttributes).toStrictEqual(0)
      })
  })
})
