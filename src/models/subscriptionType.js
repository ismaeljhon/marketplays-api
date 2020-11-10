const subscriptionTypeSchema = require('../schemas/subscriptionType')
const generateModel = require('../utils/generate-model')

// @TODO - add documentation
// this checks if the service to be added under a subscription
// are compliant to the policy defined by the type
subscriptionTypeSchema.methods.policyCompliant = (services) => {
  // @TODO - define policy check
  // will assume everything is compliant for now
  return true
}

const SubscriptionType = generateModel('SubscriptionType', subscriptionTypeSchema)

module.exports = SubscriptionType
