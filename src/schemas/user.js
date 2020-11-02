const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date
  },
  teamLeadOf: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  projectManagerOf: {
    type: [Schema.Types.ObjectId], // service
    default: []
  }
})

// plugins
userSchema.plugin(uniqueValidator)

module.exports = userSchema
