const expect = require('expect')
const faker = require('faker')
const { request } = require('../../utils/test')
const Department = require('../../models/department')

describe('department', () => {
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
    recordId
    record {
      _id
      name
    }
  }`) => {
    return request({
      query: `
        mutation {
          DepartmentCreateOne(
            record: {
              name: "${name}",
              code: "${code}",
              description: "${description}",
              slug: "${slug}",
              pricing: ${pricing},
              seoTitle: "${seoTitle}",
              seoKeywords: "${seoKeywords}",
              seoDescription: "${seoDescription}"              
            }
          ) ${returnValues}
        }
      `
    })
  }

  describe('create', () => {
    it('should create a new department', () => {
      return createDepartment(testDepartment)
        .expect(res => {
          expect(res.body).toHaveProperty('data.DepartmentCreateOne.recordId')
          expect(res.body).toHaveProperty('data.DepartmentCreateOne.record.name', testDepartment.name)
        })
        .expect(200)
    })
    it('should not create a new department when required fields are not set', () => {
      return createDepartment({
        ...testDepartment,
        name: null
      })
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.data.DepartmentCreateOne).toEqual(null)
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
        .expect(200)
    })
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
          DepartmentMany {
            _id
            name
          }
        }
      `
    })
  }

  describe('retrieve', () => {
    let departmentId = null
    it('should retrieve all departments', () => {
      return retrieveDepartments()
        .expect(res => {
          expect(res.body).toHaveProperty('data.DepartmentMany')
          expect(res.body.data.DepartmentMany).toHaveLength(1)
          departmentId = res.body.data.DepartmentMany[0]._id
        })
    })
    it('should retrieve the department by ID', () => {
      return request({
        query: `
          query {
            DepartmentById(_id: "${departmentId}") {
              _id
              name
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.DepartmentById.name')
        })
    })
  })
  describe('update', () => {
    let departmentId = null
    before(async () => {
      const department = await Department.findOne()
      departmentId = department._id
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
      recordId
      record {
        name
        code
      }
    }`) => {
      return request({
        query: `
          mutation{
            DepartmentUpdateById(
              _id: "${id}",
              record: {
                name: "${name}",
                code: "${code}",
                description: "${description}",
                slug: "${slug}",
                pricing: ${pricing},
                seoTitle: "${seoTitle}",
                seoKeywords: "${seoKeywords}",
                seoDescription: "${seoDescription}"                
              }
            ) ${returnValues}
          }
        `
      })
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
          expect(res.body).toHaveProperty('data.DepartmentUpdateById.record.name')
          expect(res.body.data.DepartmentUpdateById.record.name).toStrictEqual(updatedDepartment.name)
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
          expect(res.body).toHaveProperty('data.DepartmentUpdateById.record.name')
          expect(res.body.data.DepartmentUpdateById.record.name).toStrictEqual(updatedDepartment.name)
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
          expect(res.body.data.DepartmentUpdateById).toEqual(null)
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
    })
  })

  describe('delete', () => {
    let departmentId = null
    before(async () => {
      const department = await Department.findOne()
      departmentId = department._id
    })
    const deleteDepartment = ({
      id
    }, returnValues = `{
      recordId
      record {
        _id
      }
    }`) => {
      return request({
        query: `
          mutation{
            DepartmentRemoveById(
              _id: "${id}",
            ) ${returnValues}
          }
        `
      })
    }
    it('should delete a department', () => {
      return deleteDepartment({ id: departmentId })
        .expect(res => {
          expect(res.body).toHaveProperty('data.DepartmentRemoveById.record._id')
        })
    })
  })
})
