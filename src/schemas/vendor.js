
const Schema = require('mongoose')
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const vendorUserSchema = extendSchema(userSchema, {
  shop: {
    type: [Schema.Types.ObjectId], // shops
    ref: 'Shop',
    default: []
  }
})

module.exports = vendorUserSchema
