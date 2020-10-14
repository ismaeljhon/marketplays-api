const expect = require('expect')
const faker = require('faker')
const { request } = require('../../utils/test')
const { AuthenticationError } = require('apollo-server-express')
const { generateToken } = require('../../utils/generate-token')

generateToken()
  .then(response => {
    describe('department', () => {
      let token = response

      // retrieve without a token
      describe('retrieve without token', () => {
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

      // create with a valid token
      const departmentName = faker.lorem.words(3)
      const testDepartment = {
        name: departmentName,
        code: faker.random.alpha(4).toUpperCase(),
        description: faker.lorem.sentence(),
        slug: faker.helpers.slugify(departmentName),
        pricing: faker.commerce.price(5, 300),
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
        }).set('x-token', token)
      }

      describe('create with a valid token', () => {
        it('should create a new department', () => {
          return createDepartment(testDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('data.createDepartment.id')
              expect(res.body).toHaveProperty('data.createDepartment.name', testDepartment.name)
            })
            .expect(200)
        })
      })

      describe('create with non-unique code', () => {
        it('should not create a deparment if code is not unique', () => {
          // attempt to create a department of the same data
          return createDepartment(testDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('errors')
              expect(Array.isArray(res.body.errors)).toBe(true)
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

      describe('retrieve', () => {
        let departmentId = null
        it('should retrieve all departments', () => {
          return retrieveDepartments()
            .expect(res => {
              expect(res.body).toHaveProperty('data.departments')
              expect(res.body.data.departments).toHaveLength(1)
              departmentId = res.body.data.departments[0].id
            })
        })
        it('should retrieve a single department', () => {
          return request({
            query: `
              query {
                department(id: "${departmentId}") {
                  id
                  name
                }
              }
            `
          }).set('x-token', token)
            .expect(res => {
              expect(res.body).toHaveProperty('data.department.name')
            })
        })
        const updateDepartment = ({
          id,
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
          code
        }`) => {
          return request({
            query: `
              mutation{
                updateDepartment(
                  id: "${id}",
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
        it('should update an existing department', () => {
          const updatedDepartment = {
            id: departmentId,
            name: faker.commerce.department(),
            code: faker.random.alphaNumeric(4),
            description: faker.lorem.sentence(),
            slug: faker.commerce.slug,
            pricing: faker.random.float(),
            seoTitle: faker.lorem.sentence(5),
            seoKeywords: faker.lorem.words(5),
            seoDescription: faker.lorem.paragraph(5)
          }
          return updateDepartment(updatedDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('data.updateDepartment.name')
              expect(res.body.data.updateDepartment.name).toStrictEqual(updatedDepartment.name)
            })
        })
        it('should update select fields of an existing department', () => {
          const updatedDepartment = {
            id: departmentId,
            name: faker.commerce.department(),
            code: faker.random.alphaNumeric(4),
            description: faker.lorem.sentence(),
            pricing: faker.random.float()
          }
          return updateDepartment(updatedDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('data.updateDepartment.name')
              expect(res.body.data.updateDepartment.name).toStrictEqual(updatedDepartment.name)
            })
        })
        it('should not update an non-existent department', () => {
          const updatedDepartment = {
            id: faker.random.alphaNumeric(20),
            name: faker.commerce.department(),
            code: faker.random.alphaNumeric(4),
            description: faker.lorem.sentence(),
            slug: faker.commerce.slug,
            pricing: faker.random.float(),
            seoTitle: faker.lorem.sentence(5),
            seoKeywords: faker.lorem.words(5),
            seoDescription: faker.lorem.paragraph(5)
          }
          return updateDepartment(updatedDepartment)
            .expect(res => {
              expect(res.body).toHaveProperty('errors')
              expect(res.body.data.updateDepartment).toEqual(null)
              expect(Array.isArray(res.body.errors)).toBe(true)
            })
        })
      })
    })
  })
  .catch(err => {
    throw new AuthenticationError(err)
  })
