const expect = require('expect')
const { request } = require('../../utils/test')
const faker = require('faker')

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
  })
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
