const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')

ServiceTC.addRelation('attributes', {
  resolver: () => ItemAttributeTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.attributes
  },
  projection: { attributes: true }
})
