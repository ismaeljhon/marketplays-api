const { schemaComposer } = require('graphql-compose')

const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')
const AttributeTC = schemaComposer.getOTC('Attribute')

ItemAttributeTC.addRelation('attribute', {
  resolver: () => AttributeTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.attribute
  },
  projection: { attribute: true }
})
