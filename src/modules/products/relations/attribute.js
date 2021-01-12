const { schemaComposer } = require('graphql-compose')

const ProductTC = schemaComposer.getOTC('Product')
const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')

ProductTC.addRelation('attributes', {
  resolver: () => ItemAttributeTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.attributes
  },
  projection: { attributes: true }
})
