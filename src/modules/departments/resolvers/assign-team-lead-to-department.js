const { UserInputError } = require('apollo-server-express')
const Department = require('../../../models/department')
const User = require('../../../models/user')

const assignTeamLeadToDepartment = async (_, {
  userId,
  departmentId
}) => {
  // make sure the department, user exists
  let department = await Department.findOne({ _id: departmentId })
  if (!department) {
    throw new UserInputError(`Department of id ${departmentId} does not exist!`)
  }
  let user = await User.findOne({ _id: userId })
  if (!user) {
    throw new UserInputError(`User of id ${userId} does not exist!`)
  }
  department.teamLead = user
  await department.save()
  user.teamLeadOf.push(department)
  await user.save()
  return department
}

module.exports = assignTeamLeadToDepartment
