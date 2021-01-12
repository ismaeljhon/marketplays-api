const { schemaComposer } = require('graphql-compose')

const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')
const ItemTC = schemaComposer.getOTC('Item')

ItemAttributeTC.addRelation('item', {
  resolver: () => ItemTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.item
  },
  projection: { item: true }
})
