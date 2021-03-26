
const Schema = require('mongoose')
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const adminSchema = extendSchema(userSchema, {

  teamLeadOf: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  catTeamLeadOf: {
    type: [Schema.Types.ObjectId], // category
    default: []
  },

  projectManagerOf: {
    type: [Schema.Types.ObjectId], // service
    default: []
  }
})

module.exports = adminSchema
