const { schemaComposer } = require('graphql-compose')

const ServiceRequestTC = schemaComposer.getOTC('ServiceRequest')
const ServiceTC = schemaComposer.getOTC('Service')

ServiceRequestTC.addRelation('service', {
  resolver: () => ServiceTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.service
  },
  projection: { service: true }
})
