const { schemaComposer } = require('graphql-compose')

const AttributeTC = schemaComposer.getOTC('Attribute')
const OptionTC = schemaComposer.getOTC('Option')

AttributeTC.addRelation('options', {
  resolver: () => OptionTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.options
  },
  projection: { options: true }
})
