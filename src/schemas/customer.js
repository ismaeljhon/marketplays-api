
const Schema = require('mongoose')
const extendSchema = require('../utils/extendSchema')
const userSchema = require('../schemas/user')

const customerSchema = extendSchema(userSchema, {
  orders: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = customerSchema
