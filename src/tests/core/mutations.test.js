/*
  This tests the core, autocomposed, default mutations
  automatically created when defining a model
  The Test model will be used to cover all the default mutations
  Note that these tests are only applicable when a mutation
  is not customised
  in the event that it is customised, a separate test should be written
  for that mutation
 */
const expect = require('expect')
const { request } = require('../../utils/test')
const generateFakeDocument = require('../../utils/generate-fake-document')
const Test = require('../../models/test')
const faker = require('faker')
const slugify = require('slugify')
const {
  jsonToGraphQLQuery
} = require('json-to-graphql-query')

describe('Core mutations', () => {
  const fakeDocument = generateFakeDocument()
  describe('create', () => {
    it('should create a new document', () => {
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            createOneTest: {
              __args: {
                record: fakeDocument
              },
              record: {
                _id: true,
                name: true,
                email: true,
                slug: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.createOneTest')
          expect(res.body).toHaveProperty('data.createOneTest.record.name')

          // check if slug was auto-generated
          expect(res.body.data.createOneTest.record.slug).toStrictEqual(slugify(fakeDocument.name))
        })
        .expect(200)
    })

    it('should only create a document when required fields are set', () => {
      const { name, age } = fakeDocument
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            createOneTest: {
              __args: {
                record: {
                  name: name,
                  age: age
                }
              },
              record: {
                _id: true,
                name: true,
                email: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.data).toEqual(undefined)
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
        .expect(400)
    })

    it('should only create a document when unique fields are unique', () => {
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            createOneTest: {
              __args: {
                record: fakeDocument
              },
              record: {
                _id: true,
                name: true,
                email: true,
                slug: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
        .expect(200)
    })
  })

  describe('update', () => {
    // retrieve an existing document
    let documentId = null
    before(async () => {
      const document = await Test.findOne()
      documentId = document._id
    })

    const updatedDocument = generateFakeDocument()
    it('should update an existing document', () => {
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            updateTestById: {
              __args: {
                _id: `${documentId}`, // ObjectID needs to be a string
                record: updatedDocument
              },
              record: {
                _id: true,
                name: true,
                email: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.updateTestById')
          expect(res.body).toHaveProperty('data.updateTestById.record.email')
          expect(res.body.data.updateTestById.record.email).toStrictEqual(updatedDocument.email)
        })
    })

    it('should update select fields of an existing document', () => {
      const street = faker.address.streetName()
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            updateTestById: {
              __args: {
                _id: `${documentId}`,
                record: {
                  address: {
                    street: street
                  }
                }
              },
              record: {
                _id: true,
                name: true,
                address: {
                  street: true
                }
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.updateTestById')
          expect(res.body).toHaveProperty('data.updateTestById.record.address.street')

          // check if selected field was updated
          expect(res.body.data.updateTestById.record.address.street).toStrictEqual(street)

          // check if other fields are the same
          expect(res.body.data.updateTestById.record.name).toStrictEqual(updatedDocument.name)
        })
    })
  })

  describe('delete', () => {
    // retrieve an existing document
    let documentId = null
    before(async () => {
      const document = await Test.findOne()
      documentId = document._id
    })

    it('should delete an existing document', () => {
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            removeTestById: {
              __args: {
                _id: `${documentId}`
              },
              record: {
                _id: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.removeTestById.record._id')
          expect(res.body).not.toHaveProperty('errors')
        })
    })

    it('should only delete an existing document', () => {
      return request({
        query: jsonToGraphQLQuery({
          mutation: {
            removeTestById: {
              __args: {
                _id: `${faker.random.alphaNumeric(20)}` // non-existent code
              },
              record: {
                _id: true
              }
            }
          }
        })
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
        })
    })
  })
})
