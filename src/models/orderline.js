const mongoose = require('mongoose')

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

const Orderline = mongoose.model('Orderline', orderlineSchema)

module.exports = Orderline
