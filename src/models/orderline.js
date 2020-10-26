const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

const orderlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  },
  orderlineNumber: {
    type: String
  },
  item: {
    type: {
      type: String
    },
    price: {
      type: Number
    }
  },
  quantity: {
    type: Number
  }
})

const Orderline = generateModel('Orderline', orderlineSchema)

module.exports = Orderline
