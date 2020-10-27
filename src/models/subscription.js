const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

const subscriptionSchema = new mongoose.Schema({
  orderline: {
    type: String // @TODO - reference to orderline
  },
  subscriptionType: {
    type: String // @TODO - reference to subscription type
  },
  jobs: {
    type: [String] // @TODO - represents an array of jobs
  }
})

const Subscription = generateModel('Subscription', subscriptionSchema)

module.exports = Subscription
