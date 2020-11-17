const { schemaComposer } = require('graphql-compose')

const ServiceRequestTC = schemaComposer.getOTC('ServiceRequest')
const SubscriptionTC = schemaComposer.getOTC('Subscription')

ServiceRequestTC.addRelation('subscription', {
  resolver: () => SubscriptionTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.subscription
  },
  projection: { subscription: true }
})
