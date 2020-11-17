const { schemaComposer } = require('graphql-compose')

const OrderTC = schemaComposer.getOTC('Order')
const CustomerTC = schemaComposer.getOTC('Customer')

OrderTC.addRelation('customer', {
  resolver: () => CustomerTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.customer
  },
  projection: { customer: true }
})
