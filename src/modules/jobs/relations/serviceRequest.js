const { schemaComposer } = require('graphql-compose')

const JobTC = schemaComposer.getOTC('Job')
const ServiceRequestTC = schemaComposer.getOTC('ServiceRequest')

JobTC.addRelation('serviceRequest', {
  resolver: () => ServiceRequestTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.serviceRequest
  },
  projection: { serviceRequest: true }
})
