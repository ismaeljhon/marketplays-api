const expect = require('expect')
const { request } = require('../../utils/test')
const {
  ServiceFactory,
  ProductFactory,
  AttributeFactory,
  OptionFactory
} = require('../../utils/factories')
const {
  times
} = require('lodash')
const faker = require('faker')
const { jsonToGraphQLQuery } = require('json-to-graphql-query')
const Variant = require('../../models/variant')

describe('add variants', () => {
  // generate fake data
  let fakeData = []
  before(async () => {
    fakeData = times(2, () => {
      const attributes = times(2, () => {
        return {
          attribute: AttributeFactory.generate(),
          options: times(2, () => { return OptionFactory.generate() })
        }
      })
      const data = {
        attributes: attributes,
        variants: Variant.generateFromAttributes(attributes).map(variant => {
          return {
            ...variant,
            price: faker.random.float(200)
          }
        })
      }
      return data
    })
  })

  let service = null
  it('should add variants when creating a service', () => {
    const record = {
      ...fakeData[0],
      service: ServiceFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneService: {
          __args: {
            record: {
              name: record.service.name,
              code: record.service.code,
              price: record.service.price,
              attributes: record.attributes,
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: data.attribute.code,
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true,
            name: true,
            attributes: {
              _id: true,
              attribute: {
                name: true,
                code: true
              },
              options: {
                name: true,
                code: true
              }
            },
            variants: {
              _id: true,
              name: true,
              code: true,
              attributeData: {
                attribute: {
                  name: true,
                  code: true
                },
                option: {
                  name: true,
                  code: true
                }
              }
            }
          }
        }
      }
    })
    return request({
      query: query
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneService.record.variants')
        service = res.body.data.createOneService.record
        const variants = service.variants

        // check if variants have been correctly assigned
        expect(variants[0].name)
          .toStrictEqual(record.variants[0].name)
        expect(variants[0].attributeData[0].attribute.name)
          .toStrictEqual(record.variants[0].attributeData[0].attribute.name)
      })
  })

  it('should add the service under the created item attributes', () => {
    return request({
      query: jsonToGraphQLQuery({
        query: {
          itemAttributes: {
            __args: {
              filter: {
                item: service._id
              }
            },
            _id: true,
            item: {
              _id: true
            }
          }
        }
      })
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.itemAttributes')
        const itemAttributes = res.body.data.itemAttributes
        expect(itemAttributes.length).toStrictEqual(service.attributes.length)

        // check if the relationship has been established correctly
        expect(itemAttributes[0].item._id).toStrictEqual(`${service._id}`)
      })
  })

  it('should NOT create the service if attributes have duplicate attribute codes', () => {
    const record = {
      ...fakeData[1],
      service: ServiceFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneService: {
          __args: {
            record: {
              name: record.service.name,
              code: record.service.code,
              price: record.service.price,
              // use duplicate attribute codes
              attributes: record.attributes.map(data => {
                return {
                  ...data,
                  attribute: {
                    ...data.attribute,
                    code: 'someduplicatecode'
                  }
                }
              }),
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: data.attribute.code,
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true
          }
        }
      }
    })
    return request({
      query: query
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  it('should NOT create the serivce if duplicate option codes per attribute exists', () => {
    const record = {
      ...fakeData[1],
      service: ServiceFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneService: {
          __args: {
            record: {
              name: record.service.name,
              code: record.service.code,
              price: record.service.price,
              // use duplicate option codes
              attributes: record.attributes.map(data => {
                return {
                  ...data,
                  options: data.options.map(option => {
                    return {
                      ...option,
                      code: 'someduplicateoptioncode'
                    }
                  })
                }
              }),
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: data.attribute.code,
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true
          }
        }
      }
    })
    return request({
      query: query
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  // test adding variants with duplicate variant codes
  it('should NOT create the serivce if duplicate variant codes exists', () => {
    const record = {
      ...fakeData[1],
      service: ServiceFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneService: {
          __args: {
            record: {
              name: record.service.name,
              code: record.service.code,
              price: record.service.price,
              attributes: record.attributes,
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  code: 'someduplicatecode', // use duplicate variant codes
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: data.attribute.code,
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true
          }
        }
      }
    })
    return request({
      query: query
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
  })

  // test adding variants with invalid attribute data
  it('should NOT create the serivce if invalid variant attribute data exists', () => {
    const record = {
      ...fakeData[1],
      service: ServiceFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneService: {
          __args: {
            record: {
              name: record.service.name,
              code: record.service.code,
              price: record.service.price,
              attributes: record.attributes,
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: 'someinvalidcode', // use a non-existent code
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true
          }
        }
      }
    })
    return request({
      query: query
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
            item: null
          })
        }
      `
    })
      .expect(res => {
        expect(res.body.data).toHaveProperty('countItemAttributes')
        expect(res.body.data.countItemAttributes).toStrictEqual(0)
      })
  })

  it('should add variants when creating a product', () => {
    const record = {
      ...fakeData[1],
      product: ProductFactory.generate()
    }
    const query = jsonToGraphQLQuery({
      mutation: {
        createOneProduct: {
          __args: {
            record: {
              name: record.product.name,
              sku: record.product.sku,
              price: record.product.price,
              attributes: record.attributes,
              variants: record.variants.map(variant => {
                return {
                  ...variant,
                  attributeData: variant.attributeData.map(data => {
                    return {
                      attribute: data.attribute.code,
                      option: data.option.code
                    }
                  })
                }
              })
            }
          },
          record: {
            _id: true,
            name: true,
            attributes: {
              attribute: {
                name: true,
                code: true
              },
              options: {
                name: true,
                code: true
              }
            },
            variants: {
              _id: true,
              name: true,
              code: true,
              attributeData: {
                attribute: {
                  name: true,
                  code: true
                },
                option: {
                  name: true,
                  code: true
                }
              }
            }
          }
        }
      }
    })
    return request({
      query: query
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.createOneProduct.record.variants')
        const variants = res.body.data.createOneProduct.record.variants

        // check if variants have been correctly assigned
        expect(variants[0].name)
          .toStrictEqual(record.variants[0].name)
        expect(variants[0].attributeData[0].attribute.name)
          .toStrictEqual(record.variants[0].attributeData[0].attribute.name)
      })
  })
})
