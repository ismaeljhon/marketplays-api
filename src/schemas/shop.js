const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const shopSchema = new mongoose.Schema({

  name: {
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
shopSchema.plugin(uniqueValidator)

module.exports = shopSchema
