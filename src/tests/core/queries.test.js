/*
  This tests the core, autocomposed, default queries
  automatically created when defining a model
  The Test model will be used to cover all the default queries
  Note that these tests are only applicable when a query
  is not customised
  in the event that it is customised, a separate test should be written
  for that query
 */
const expect = require('expect')
const { request } = require('../../utils/test')
const generateFakeDocument = require('../../utils/generate-fake-document')
const Test = require('../../models/test')

// insert dummy documents
const documents = [
  generateFakeDocument({
    age: 5
  }),
  generateFakeDocument({
    age: 40
  }),
  generateFakeDocument({
    age: 40
  }),
  generateFakeDocument({
    age: 10,
    address: {
      country: 'Philippines'
    }
  })
]
describe('retrieve', () => {
  before(async () => {
    await Test.insertMany(documents)
  })
  let id = null
  describe('many', () => {
    it('should retrieve all documents', () => {
      return request({
        query: `
          query {
            tests {
              name
              email
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.tests')
          expect(res.body.data.tests).toHaveLength(documents.length)
        })
    })

    it('should retrieve all filtered documents', () => {
      return request({
        query: `
          query {
            tests(filter: {
              _operators: {
                age: {
                  gt: 30
                }
              }
            }) {
              _id
              name
              age
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.tests')
          expect(res.body.data.tests).toHaveLength(2)
          id = res.body.data.tests[0]._id
        })
    })
  })
  describe('by id', () => {
    it('should retrieve a document by ID', () => {
      return request({
        query: `
          query {
            test(_id: "${id}") {
              _id
              name
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.test')
          expect(res.body.data.test._id).toStrictEqual(id)
        })
    })
  })

  describe('get one', () => {
    it('should retrieve a single filtered document', () => {
      return request({
        query: `
          query {
            getOneTest(filter: {
              _operators: {
                age: {
                  lt: 10
                }
              }
            }) {
              _id
              name
              age
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.getOneTest._id')
          expect(res.body.data.getOneTest.age).toBeLessThan(10)
        })
    })
  })

  describe('count', () => {
    it('should count all documents', () => {
      return request({
        query: `
          query {
            countTests
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.countTests')
          expect(res.body.data.countTests).toStrictEqual(documents.length)
        })
    })
    it('should count all filtered documents', () => {
      return request({
        query: `
          query {
            countTests(filter: {
              _operators: {
                age: {
                  gt: 5                    
                }
              }
            })
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.countTests')
          expect(res.body.data.countTests).toStrictEqual(3)
        })
    })
  })
})
