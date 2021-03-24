const mongoose = require('mongoose')
const Schema = require('mongoose')

const customerSchema = new mongoose.Schema({
  orders: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = customerSchema
