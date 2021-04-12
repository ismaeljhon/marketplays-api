const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const storeSchema = new mongoose.Schema({

  businessName: {
    type: String,
    required: true,
    default: ''
  },

  contactNumber: {
    type: String,
    required: true,
    default: ''
  },
  street: {
    type: String,
    required: true,
    default: ''
  },
  city: {
    type: String,
    required: true,
    default: ''
  },
  state: { // province
    type: String,
    required: true,
    default: ''
  },
  countryCode: {
    type: String,
    required: true,
    default: ''
  },
  zipCode: {
    type: String,
    required: true,
    default: ''
  },

  active: {
    type: Boolean,
    default: false
  },

  ownBy: {
    type: Schema.Types.ObjectId,
    required: true
  }

})

// plugins
storeSchema.plugin(uniqueValidator)

module.exports = storeSchema
