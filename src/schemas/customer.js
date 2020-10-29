const mongoose = require('mongoose')
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
  }
})

module.exports = customerSchema
