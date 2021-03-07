const mongoose = require('mongoose')
const Schema = require('mongoose')
const faker = require('faker')
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
  catTeamLeadOf: {
    type: [Schema.Types.ObjectId], // category
    default: []
  },

  projectManagerOf: {
    type: [Schema.Types.ObjectId], // service
    default: []
  },
  verificationCode: {
    type: String,
    default: function () {
      return faker.random.alphaNumeric(20) // @TODO - use something more secure?
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  isFTP: {
    type: Boolean,
    default: null
  },
  isECommerce: {
    type: Boolean,
    default: null
  },
  isSocialMedia: {
    type: Boolean,
    default: true
  }
})

// plugins
userSchema.plugin(uniqueValidator)

module.exports = userSchema
