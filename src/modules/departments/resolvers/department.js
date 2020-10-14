const { ApolloError } = require('apollo-server-express')
const Department = require('../../../models/department')

const department = async (_, args) => {
  const { id } = args
  const department = await Department
    .findById(id)

  if (!department) {
    throw new ApolloError('Not found')
  }

  return department
}

module.exports = department
