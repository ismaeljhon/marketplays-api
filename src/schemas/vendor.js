
const Schema = require('mongoose')
const mongoose = require('mongoose')

const vendorUserSchema = new mongoose.Schema({

  businessName: {
    type: String,
    required: true,
    default: ''
  },
  businessAddress: {
    type: String,
    required: true,
    default: ''
  },
  phoneNumber: {
    type: String,
    required: true,
    default: ''
  },
  dateTimeForVerification: {
    type: Date,
    required: true,
    default: ''
  },
  validId: {
    type: String,
    default: '' // path of image
  },
  validIdWithSelfie: {
    type: String,
    default: '' // path of image
  },
  hasExistingMarketplaysPlatform: {
    type: Boolean,
    require: true,
    default: false
  },
  stores: {
    type: [Schema.Types.ObjectId], // Store
    default: []
  }
})

module.exports = vendorUserSchema
