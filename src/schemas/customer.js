
const Schema = require('mongoose')
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const customerSchema = extendSchema(userSchema, {
  orders: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  address: {
    type: String,
    required: true
  },
  interestedIn: {
    type: [String],
    default: []
  }
})

module.exports = customerSchema
