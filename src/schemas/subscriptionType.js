const mongoose = require('mongoose')

const subscriptionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  short_description: {
    type: String
  },
  policy: {
    type: [String] // @TODO - need a policy entity?
  }
})

module.exports = subscriptionTypeSchema
