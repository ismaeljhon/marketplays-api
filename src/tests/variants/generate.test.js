const expect = require('expect')
const { request } = require('../../utils/test')
const {
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')

describe('generate variants', () => {
  let attributeData = []
  for (let x = 0; x <= 1; x++) {
    let attribute = AttributeFactory.generate()
    let options = []
    for (let y = 0; y <= 2; y++) {
      options.push(OptionFactory.generate())
    }
    attributeData.push({
      attribute: attribute,
      options: options
    })
  }

  it('should generate variants based off the provided attribute, option data', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[0].options[1].name}",
                    code: "${attributeData[0].options[1].code}"
                  },
                  {
                    name: "${attributeData[0].options[2].name}",
                    code: "${attributeData[0].options[2].code}"
                  },
                ]
              },
              {
                attribute: {
                  name: "${attributeData[1].attribute.name}",
                  code: "${attributeData[1].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[1].options[0].name}",
                    code: "${attributeData[1].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[1].name}",
                    code: "${attributeData[1].options[1].code}"
                  },
                  {
                    name: "${attributeData[1].options[2].name}",
                    code: "${attributeData[1].options[2].code}"
                  },
                ]
              }
            ]
          }) {
            record {
              variants {
                name
                code
                attributeData {
                  attribute {
                    code
                    name
                  }
                  option {
                    code
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
        expect(res.body).toHaveProperty('data.generateVariants.record.variants')

        // make sure it generates the correct number of variants
        expect(res.body.data.generateVariants.record.variants).toHaveLength(9)

        // check if names are correct
        expect(res.body.data.generateVariants.record.variants[0].attributeData[0].attribute.name)
          .toStrictEqual(attributeData[0].attribute.name)
        expect(res.body.data.generateVariants.record.variants[0].name)
          .toStrictEqual(`${attributeData[0].options[0].name}, ${attributeData[1].options[0].name}`)
        expect(res.body.data.generateVariants.record.variants[3].name)
          .toStrictEqual(`${attributeData[0].options[1].name}, ${attributeData[1].options[0].name}`)

        // check if variant codes are correctly generated
        expect(res.body.data.generateVariants.record.variants[0].code)
          .toStrictEqual(`${attributeData[0].options[0].code}-${attributeData[1].options[0].code}`)
      })
  })

  it('should NOT generate variants when duplicate attribute codes are provided', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[0].options[1].name}",
                    code: "${attributeData[0].options[1].code}"
                  },
                  {
                    name: "${attributeData[0].options[2].name}",
                    code: "${attributeData[0].options[2].code}"
                  },
                ]
              },
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[1].options[0].name}",
                    code: "${attributeData[1].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[1].name}",
                    code: "${attributeData[1].options[1].code}"
                  },
                  {
                    name: "${attributeData[1].options[2].name}",
                    code: "${attributeData[1].options[2].code}"
                  },
                ]
              }
            ]
          }) {
            record {
              variants {
                name
                code
                attributeData {
                  attribute {
                    code
                    name
                  }
                  option {
                    code
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  it('should NOT generate variants when duplicate option codes per attribute are provided', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[0].options[1].name}",
                    code: "${attributeData[0].options[1].code}"
                  },
                  {
                    name: "${attributeData[0].options[2].name}",
                    code: "${attributeData[0].options[2].code}"
                  },
                ]
              },
              {
                attribute: {
                  name: "${attributeData[1].attribute.name}",
                  code: "${attributeData[1].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[1].options[0].name}",
                    code: "${attributeData[1].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[0].name}",
                    code: "${attributeData[1].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[2].name}",
                    code: "${attributeData[1].options[2].code}"
                  },
                ]
              }
            ]
          }) {
            record {
              variants {
                name
                code
                attributeData {
                  attribute {
                    code
                    name
                  }
                  option {
                    code
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  it('should generate variants even if option codes are reused between attributes, as long as it is of the same name', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[0].options[1].name}",
                    code: "${attributeData[0].options[1].code}"
                  },
                  {
                    name: "${attributeData[0].options[2].name}",
                    code: "${attributeData[0].options[2].code}"
                  },
                ]
              },
              {
                attribute: {
                  name: "${attributeData[1].attribute.name}",
                  code: "${attributeData[1].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[1].name}",
                    code: "${attributeData[1].options[1].code}"
                  },
                  {
                    name: "${attributeData[1].options[2].name}",
                    code: "${attributeData[1].options[2].code}"
                  },
                ]
              }
            ]
          }) {
            record {
              variants {
                name
                code
                attributeData {
                  attribute {
                    code
                    name
                  }
                  option {
                    code
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
        expect(res.body).toHaveProperty('data.generateVariants.record.variants')

        // make sure it generates the correct number of variants
        expect(res.body.data.generateVariants.record.variants).toHaveLength(9)

        // check if names are correct
        expect(res.body.data.generateVariants.record.variants[0].attributeData[0].attribute.name)
          .toStrictEqual(attributeData[0].attribute.name)
        expect(res.body.data.generateVariants.record.variants[0].name)
          .toStrictEqual(`${attributeData[0].options[0].name}, ${attributeData[0].options[0].name}`) // using the same option code and name
        expect(res.body.data.generateVariants.record.variants[3].name)
          .toStrictEqual(`${attributeData[0].options[1].name}, ${attributeData[0].options[0].name}`) // using the same option code and name

        // check if variant codes are correctly generated
        expect(res.body.data.generateVariants.record.variants[0].code)
          .toStrictEqual(`${attributeData[0].options[0].code}-${attributeData[0].options[0].code}`) // using the same option code and name
      })
  })

  it('should NOT generate variants if option codes are reused between attributes, but uses a different name', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: {
                  name: "${attributeData[0].attribute.name}",
                  code: "${attributeData[0].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[0].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[0].options[1].name}",
                    code: "${attributeData[0].options[1].code}"
                  },
                  {
                    name: "${attributeData[0].options[2].name}",
                    code: "${attributeData[0].options[2].code}"
                  },
                ]
              },
              {
                attribute: {
                  name: "${attributeData[1].attribute.name}",
                  code: "${attributeData[1].attribute.code}"
                },
                options: [
                  {
                    name: "${attributeData[1].options[0].name}",
                    code: "${attributeData[0].options[0].code}"
                  },
                  {
                    name: "${attributeData[1].options[1].name}",
                    code: "${attributeData[1].options[1].code}"
                  },
                  {
                    name: "${attributeData[1].options[2].name}",
                    code: "${attributeData[1].options[2].code}"
                  },
                ]
              }
            ]
          }) {
            record {
              variants {
                name
                code
                attributeData {
                  attribute {
                    code
                    name
                  }
                  option {
                    code
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
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })
})
