const { schemaComposer } = require('graphql-compose')

const SubscriptionTC = schemaComposer.getOTC('Subscription')
const SubscriptionTypeTC = schemaComposer.getOTC('SubscriptionType')

SubscriptionTC.addRelation('subscriptionType', {
  resolver: () => SubscriptionTypeTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.subscriptionType
  },
  projection: { subscriptionType: true }
})
