const mongoose = require('mongoose')
const Schema = require('mongoose')

const orderlineSchema = new mongoose.Schema({
  order: {
    type: Schema.Types.ObjectId
  },
  orderlineNumber: {
    type: String
  },
  item: {
    type: Schema.Types.ObjectId
  },
  unitPrice: {
    type: Number
  },
  quantity: {
    type: Number
  },
  totalPrice: {
    type: Number
  },
  sort: {
    type: Number
  }
})

module.exports = orderlineSchema
