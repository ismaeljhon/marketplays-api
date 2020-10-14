const { UserInputError } = require('apollo-server-express')
const Department = require('../../../models/department')

const deleteDepartment = async (_, {
  id
}) => {
  // make sure the department exists
  let department = await Department.findOne({ _id: id })
  if (!department) {
    throw new UserInputError(`Department of id ${id} does not exist!`)
  }

  await Department.deleteOne({ _id: id }, (error) => {
    if (error) {
      throw new UserInputError(error)
    }
  })

  // @TODO - should it respond with a success flag?
  return {
    id: id
  }
}

module.exports = deleteDepartment
