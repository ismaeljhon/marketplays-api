
const Schema = require('mongoose')
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({

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
