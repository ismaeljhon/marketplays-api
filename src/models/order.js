const mongoose = require('mongoose')

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

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
