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

  it('should generate variants out of the attribute data', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: "${attributeData[0].attribute.name}",
                options: [
                  "${attributeData[0].options[0].name}",
                  "${attributeData[0].options[1].name}",
                  "${attributeData[0].options[2].name}"
                ]
              },
              {
                attribute: "${attributeData[1].attribute.name}",
                options: [
                  "${attributeData[1].options[0].name}",
                  "${attributeData[1].options[1].name}",
                  "${attributeData[1].options[2].name}"
                ]
              }
            ]            
          }) {
            record {
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
        expect(res.body).toHaveProperty('data.generateVariants.record.variants')
        expect(res.body.data.generateVariants.record.variants).toHaveLength(9)
        expect(res.body.data.generateVariants.record.variants[0].attributeData[0].attribute.name).toStrictEqual(attributeData[0].attribute.name)
        expect(res.body.data.generateVariants.record.variants[0].name).toStrictEqual(`${attributeData[0].options[0].name}, ${attributeData[1].options[0].name}`)
        expect(res.body.data.generateVariants.record.variants[3].name).toStrictEqual(`${attributeData[0].options[1].name}, ${attributeData[1].options[0].name}`)
      })
  })

  it('should not generate if attribute name is not unique to the current data', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: "${attributeData[0].attribute.name}",
                options: [
                  "${attributeData[0].options[0].name}",
                  "${attributeData[0].options[1].name}",
                  "${attributeData[0].options[2].name}"
                ]
              },
              {
                attribute: "${attributeData[0].attribute.name}",
                options: [
                  "${attributeData[0].options[0].name}",
                  "${attributeData[0].options[1].name}",
                  "${attributeData[0].options[2].name}"
                ]
              }
            ]
          }) {
            record {
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
        expect(res.body.data.generateVariants).toBeNull()
      })
  })

  it('should not generate if option name is not unique to the attribute data', () => {
    return request({
      query: `
        mutation {
          generateVariants(record: {
            attributeData: [
              {
                attribute: "${attributeData[0].attribute.name}",
                options: [
                  "${attributeData[0].options[0].name}",
                  "${attributeData[0].options[1].name}",
                  "${attributeData[0].options[2].name}"
                ]
              },
              {
                attribute: "${attributeData[1].attribute.name}",
                options: [
                  "${attributeData[1].options[0].name}",
                  "${attributeData[1].options[0].name}",
                  "${attributeData[1].options[2].name}"
                ]
              }
            ]
          }) {
            record {
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
        expect(res.body.data.generateVariants).toBeNull()
      })
  })
})
