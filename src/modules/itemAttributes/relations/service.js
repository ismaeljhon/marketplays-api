const { schemaComposer } = require('graphql-compose')

const ItemAttributeTC = schemaComposer.getOTC('ItemAttribute')
const ServiceTC = schemaComposer.getOTC('Service')

ItemAttributeTC.addRelation('service', {
  resolver: () => ServiceTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.service
  },
  projection: { service: true }
})
