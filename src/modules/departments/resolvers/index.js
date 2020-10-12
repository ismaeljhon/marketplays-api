const createDepartment = require('./create-department')

const resolvers = {
  Query: {
  },
  Mutation: {
    createDepartment
  }
}

module.exports = resolvers
