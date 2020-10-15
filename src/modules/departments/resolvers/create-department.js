const { UserInputError } = require('apollo-server-express')
const Department = require('../../../models/department')

const createDepartment = async (_, {
  name,
  code,
  description,
  slug,
  pricing,
  seoTitle,
  seoKeywords,
  seoDescription
}) => {
  try {
    const department = await Department.create({
      name,
      code,
      description,
      slug,
      pricing,
      seoTitle,
      seoKeywords,
      seoDescription
    })

    return {
      ...department._doc,
      id: department._id
    }
  } catch (error) {
    throw new UserInputError(error)
  }
}

module.exports = createDepartment
