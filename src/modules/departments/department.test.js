const expect = require('expect')
const { request } = require('../../utils/test')
const { AuthenticationError } = require('apollo-server-express')
const { generateToken } = require('../../utils/generate-token')
const faker = require('faker')

// retrieve without a token
describe('department', () => {
  describe('create', () => {
    it('should not retrieve departments', () => {
      return request({
        query: `
          query {
            departments {
              id
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
        })
        .expect(200)
    })
  })
})

const testDepartment = {
  name: faker.commerce.department(),
  code: faker.random.alphaNumeric(4),
  description: faker.lorem.sentence(),
  slug: faker.commerce.slug,
  pricing: faker.random.float(),
  seoTitle: faker.lorem.sentence(5),
  seoKeywords: faker.lorem.words(5),
  seoDescription: faker.lorem.paragraph(5)
}

// create with a valid token
generateToken()
  .then(response => {
    let token = response
    const createDepartment = ({
      name,
      code,
      description,
      slug,
      pricing,
      seoTitle,
      seoKeywords,
      seoDescription
    }, returnValues = `{
      id
      name
    }`) => {
      return request({
        query: `
          mutation {
            createDepartment(
              name: "${name}",
              code: "${code}",
              description: "${description}",
              slug: "${slug}",
              pricing: ${pricing},
              seoTitle: "${seoTitle}",
              seoKeywords: "${seoKeywords}",
              seoDescription: "${seoDescription}"
            ) ${returnValues}
          }
        `
      }).set('x-token', token)
    }
    describe('department', () => {
      describe('create', () => {
        it('should create a new department', () => {
          return createDepartment(testDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('data.createDepartment.id')
              expect(res.body).toHaveProperty('data.createDepartment.name', testDepartment.name)
            })
            .expect(200)
        })
      })
    })

    describe('department', () => {
      describe('create', () => {
        it('should not create a deparment if code is not unique', () => {
          // attempt to create a department of the same data
          return createDepartment(testDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('errors')
              expect(Array.isArray(res.body.errors)).toBe(true)
            })
        })
      })
    })

    const retrieveDepartments = () => {
      return request({
        query: `
          query {
            departments {
              id
              name
            }
          }
        `
      }).set('x-token', token)
    }
    describe('department', () => {
      describe('retrieve all', () => {
        it('should retrieve all departments', () => {
          return retrieveDepartments()
            .expect(res => {
              expect(res.body).toHaveProperty('data.departments')
              expect(res.body.data.departments).toHaveLength(1)
            })
        })
      })
    })
  })
  .catch(err => {
    throw new AuthenticationError(err)
  })
