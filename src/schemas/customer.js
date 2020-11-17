const mongoose = require('mongoose')
const Schema = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String // @TODO: define an address type?
  },
  email: {
    type: String
  },
  orders: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = customerSchema
