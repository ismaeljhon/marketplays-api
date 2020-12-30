const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  }
})

attributeSchema.plugin(uniqueValidator)

module.exports = attributeSchema
