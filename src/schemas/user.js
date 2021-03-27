const mongoose = require('mongoose')
const Schema = require('mongoose')
const faker = require('faker')
const uniqueValidator = require('mongoose-unique-validator')

// Admin,Vendor,TFP,Customer
const baseOptions = {
  discriminatorKey: 'UserType',
  collection: 'users'
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: ''
  },
  middleName: {
    type: String,
    required: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: false
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

  contactNumber: {
    type: String,
    required: true,
    default: ''
  }
}, baseOptions)

// plugins
userSchema.plugin(uniqueValidator)

module.exports = userSchema
