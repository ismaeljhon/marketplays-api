const subscriptionSchema = require('../schemas/subscription')
const generateModel = require('../utils/generate-model')

const Subscription = generateModel('Subscription', subscriptionSchema)

module.exports = Subscription
