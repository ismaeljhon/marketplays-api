const { schemaComposer } = require('graphql-compose')

const OrderlineTC = schemaComposer.getOTC('Orderline')
const OrderTC = schemaComposer.getOTC('Order')

OrderlineTC.addRelation('order', {
  resolver: () => OrderTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.order
  },
  projection: { order: true }
})
