const { schemaComposer } = require('graphql-compose')

const OrderlineTC = schemaComposer.getOTC('Orderline')
const ProductTC = schemaComposer.getOTC('Product')

OrderlineTC.addRelation('item', {
  resolver: () => ProductTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.item
  },
  projection: { item: true }
})
