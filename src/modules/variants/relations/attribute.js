const { schemaComposer } = require('graphql-compose')

const VariantAttributeDataTC = schemaComposer.getOTC('VariantAttributeData')
const AttributeTC = schemaComposer.getOTC('Attribute')

VariantAttributeDataTC.addRelation('attribute', {
  resolver: () => AttributeTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.attribute
  },
  projection: { attribute: true }
})
