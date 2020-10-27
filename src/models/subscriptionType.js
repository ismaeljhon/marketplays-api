const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

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

const SubscriptionType = generateModel('SubscriptionType', subscriptionTypeSchema)

module.exports = SubscriptionType
