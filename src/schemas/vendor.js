
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const vendorUserSchema = extendSchema(userSchema, {

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
  }
})

module.exports = vendorUserSchema
