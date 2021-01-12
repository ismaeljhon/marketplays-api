const { schemaComposer } = require('graphql-compose')

const ItemTC = schemaComposer.getOTC('Item')
const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')

ItemTC.addRelation('attributes', {
  resolver: () => ItemAttributeTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.attributes
  },
  projection: { attributes: true }
})
