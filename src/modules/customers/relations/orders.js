const { schemaComposer } = require('graphql-compose')

const CustomerTC = schemaComposer.getOTC('Customer')
const OrderTC = schemaComposer.getOTC('Order')

CustomerTC.addRelation('orders', {
  resolver: () => OrderTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.orders
  },
  projection: { orders: true }
})
