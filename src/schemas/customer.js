
const Schema = require('mongoose')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  orders: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  address: {
    type: String,
    required: true,
    default: ''
  },
  interestedIn: {
    type: [String],
    default: []
  }
})

module.exports = customerSchema
