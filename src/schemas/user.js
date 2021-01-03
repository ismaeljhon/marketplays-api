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
    required: true,
    unique: true
  },
  skills: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true
  },
  knowledge: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true
  },
  mentor: {
    type: Schema.Types.ObjectId,
    required: false
  },
  mentorshipCertified: {
    type: Boolean,
    required: false,
    default: false
  },
  emailVerified: {
    type: Boolean,
    required: false,
    default: false
  },
  verificationCode: {
    type: String,
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
    type: [Schema.Types.ObjectId],
    default: []
  },
  projectManagerOf: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

// plugins
userSchema.plugin(uniqueValidator)

module.exports = userSchema
