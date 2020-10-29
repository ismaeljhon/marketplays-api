const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    index: true
  }
})

testSchema.plugin(uniqueValidator)

module.exports = testSchema
