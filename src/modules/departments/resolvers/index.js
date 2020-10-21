const departments = require('./departments')
const department = require('./department')
const createDepartment = require('./create-department')
const updateDepartment = require('./update-department')
const deleteDepartment = require('./delete-department')
const assignTeamLeadToDepartment = require('./assign-team-lead-to-department')

const resolvers = {
  Query: {
    department,
    departments
  },
  Mutation: {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    assignTeamLeadToDepartment
  }
}

module.exports = resolvers
