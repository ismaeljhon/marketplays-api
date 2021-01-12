const mongoose = require('mongoose')
const Schema = require('mongoose')

const itemAttributeSchema = new mongoose.Schema({
  item: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Item'
  },
  attribute: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Attribute'
  },
  options: [{
    type: Schema.Types.ObjectId,
    ref: 'Option'
  }]
})

module.exports = itemAttributeSchema
