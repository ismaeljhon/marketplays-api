const { schemaComposer } = require('graphql-compose')

const VariantAttributeDataTC = schemaComposer.getOTC('VariantAttributeData')
const OptionTC = schemaComposer.getOTC('Option')

VariantAttributeDataTC.addRelation('option', {
  resolver: () => OptionTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.option
  },
  projection: { option: true }
})
