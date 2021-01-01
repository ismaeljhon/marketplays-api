const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  skills: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  knowledge: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  mentor: {
    type: Schema.Types.ObjectId,
    required: true,
    default: ''
  },
  mentorshipCertified: {
    type: Boolean, // department
    required: false,
    default: false
  },
  emailVerified: {
    type: Boolean, // department
    required: false,
    default: false
  },
  verificationCode: {
    type: String, // department
    required: true
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
