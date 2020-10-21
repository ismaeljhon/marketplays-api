const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  orderline: {
    type: String // @TODO - reference to orderline
  },
  subscriptionType: {
    type: String // @TODO - reference to subscription type
  },
  services: {
    type: [String] // @TODO - represents an array or services
  }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription
