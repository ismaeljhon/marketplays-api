const { schemaComposer } = require('graphql-compose')

const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')
const ProductTC = schemaComposer.getOTC('Product')

ItemAttributeTC.addRelation('product', {
  resolver: () => ProductTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.product
  },
  projection: { product: true }
})
