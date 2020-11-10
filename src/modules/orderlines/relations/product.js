const { schemaComposer } = require('graphql-compose')

const OrderlineTC = schemaComposer.getOTC('Orderline')
const ProductTC = schemaComposer.getOTC('Product')

OrderlineTC.addRelation('product', {
  resolver: () => ProductTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.product
  },
  projection: { product: true }
})
