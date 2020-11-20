const { schemaComposer } = require('graphql-compose')

const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')
const OptionTC = schemaComposer.getOTC('Option')

ItemAttributeTC.addRelation('options', {
  resolver: () => OptionTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.options
  },
  projection: { options: true }
})
