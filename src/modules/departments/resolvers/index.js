const departments = require('./departments')
const department = require('./department')
const createDepartment = require('./create-department')
const updateDepartment = require('./update-department')

const resolvers = {
  Query: {
    department,
    departments
  },
  Mutation: {
    createDepartment,
    updateDepartment
  }
}

module.exports = resolvers
