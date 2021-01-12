const { schemaComposer } = require('graphql-compose')

const VariantTC = schemaComposer.getOTC('Variant')
const Item = schemaComposer.getOTC('Item')

VariantTC.addRelation('item', {
  resolver: () => Item.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.item
  },
  projection: { item: true }
})
