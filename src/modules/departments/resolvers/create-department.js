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
  // code should be unique
  const existingDepartment = await Department.findOne({
    code: code
  })
  if (existingDepartment) {
    throw new UserInputError(`Department of code '${code}' aleady exists!`)
  }

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
}

module.exports = createDepartment
