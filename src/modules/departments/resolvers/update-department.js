const { UserInputError } = require('apollo-server-express')
const Department = require('../../../models/department')

const updateDepartment = async (_, {
  id,
  name,
  code,
  description,
  slug,
  pricing,
  seoTitle,
  seoKeywords,
  seoDescription
}) => {
  // make sure the department exists
  let department = await Department.findOne({ _id: id })
  if (!department) {
    throw new UserInputError(`Department of id ${id} does not exist!`)
  }
  department = await Department.findOneAndUpdate({ _id: id }, { $set: {
    name: name,
    code: code,
    description: description,
    slug: slug,
    pricing: pricing,
    seoTitle: seoTitle,
    seoKeywords: seoKeywords,
    seoDescription: seoDescription
  } }, {
    returnOriginal: false,
    useFindAndModify: false,
    runValidators: true,
    context: 'query'
  })
  return department
}

module.exports = updateDepartment
