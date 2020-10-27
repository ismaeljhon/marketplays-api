const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  },
  orderlines: {
    type: [String] // @TODO - this will be an array of products or services
  }
})

const Order = generateModel('Order', orderSchema)

module.exports = Order
