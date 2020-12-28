const { schemaComposer } = require('graphql-compose')

const VariantTC = schemaComposer.getOTC('Variant')
const ServiceTC = schemaComposer.getOTC('Service')

VariantTC.addRelation('service', {
  resolver: () => ServiceTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.service
  },
  projection: { service: true }
})
