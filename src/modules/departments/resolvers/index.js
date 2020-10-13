const departments = require('./departments')
const createDepartment = require('./create-department')

const resolvers = {
  Query: {
    departments
  },
  Mutation: {
    createDepartment
  }
}

module.exports = resolvers
