const mongoose = require('mongoose')
const Schema = require('mongoose')

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  pricing: {
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

module.exports = variantSchema
