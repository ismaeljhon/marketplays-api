const { schemaComposer } = require('graphql-compose')

const OrderTC = schemaComposer.getOTC('Order')
const OrderlineTC = schemaComposer.getOTC('Orderline')

OrderTC.addRelation('orderlines', {
  resolver: () => OrderlineTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.orderlines
  },
  projection: { orderlines: true }
})
