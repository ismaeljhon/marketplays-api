const mongoose = require('mongoose')
const Schema = require('mongoose')

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
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = orderSchema
