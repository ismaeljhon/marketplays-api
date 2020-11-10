const { schemaComposer } = require('graphql-compose')

const OrderlineTC = schemaComposer.getOTC('Orderline')
const SubscriptionTC = schemaComposer.getOTC('Subscription')

OrderlineTC.addRelation('subscription', {
  resolver: () => SubscriptionTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.subscription
  },
  projection: { subscription: true }
})
