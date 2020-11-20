const mongoose = require('mongoose')
const Schema = require('mongoose')

const itemAttributeSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    default: null
  },
  service: {
    type: Schema.Types.ObjectId,
    default: null
  },
  attribute: {
    type: Schema.Types.ObjectId,
    required: true
  },
  options: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = itemAttributeSchema
