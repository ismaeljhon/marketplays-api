const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

optionSchema.plugin(uniqueValidator)

module.exports = optionSchema
