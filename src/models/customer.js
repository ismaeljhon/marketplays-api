const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

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

const Customer = generateModel('Customer', customerSchema)

module.exports = Customer
