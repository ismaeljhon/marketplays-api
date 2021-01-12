const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  attributeData: {
    type: [{
      attribute: {
        type: Schema.Types.ObjectId
      },
      option: {
        type: Schema.Types.ObjectId
      }
    }]
  },
  service: { // @TODO - utilise fragments, discriminators. single field for both product or service
    type: Schema.Types.ObjectId
  }
})

variantSchema.plugin(uniqueValidator)

module.exports = variantSchema
