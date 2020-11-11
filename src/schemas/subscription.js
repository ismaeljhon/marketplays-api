const mongoose = require('mongoose')
const Schema = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  orderline: { // @TODO - required?
    type: Schema.Types.ObjectId,
    default: null
  },
  subscriptionType: {
    type: Schema.Types.ObjectId
  },
  services: {
    type: [Schema.Types.ObjectId]
  },
  totalPrice: {
    type: Number
  }
})

module.exports = subscriptionSchema
