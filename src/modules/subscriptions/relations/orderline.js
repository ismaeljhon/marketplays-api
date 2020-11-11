const { schemaComposer } = require('graphql-compose')

const SubscriptionTC = schemaComposer.getOTC('Subscription')
const OrderlineTC = schemaComposer.getOTC('Orderline')

SubscriptionTC.addRelation('orderline', {
  resolver: () => OrderlineTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.orderline
  },
  projection: { orderline: true }
})
