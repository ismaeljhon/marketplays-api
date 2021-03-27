
const Schema = require('mongoose')
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const vendorUserSchema = extendSchema(userSchema, {
  shops: {
    type: [Schema.Types.ObjectId], // shops
    ref: 'Shop',
    default: []
  },
  dateTimeForVerification: {
    type: Date
  },
  idPic: {
    type: String,
    default: '' // path of image
  },
  selfiePic: {
    type: String,
    default: '' // path of image
  }

})

module.exports = vendorUserSchema