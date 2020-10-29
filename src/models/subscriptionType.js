const subscriptionTypeSchema = require('../schemas/subscriptionType')
const generateModel = require('../utils/generate-model')

const SubscriptionType = generateModel('SubscriptionType', subscriptionTypeSchema)

module.exports = SubscriptionType
