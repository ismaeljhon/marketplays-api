const { schemaComposer } = require('graphql-compose')

const SubscriptionTC = schemaComposer.getOTC('Subscription')
const ServiceRequestTC = schemaComposer.getOTC('ServiceRequest')

SubscriptionTC.addRelation('serviceRequests', {
  resolver: () => ServiceRequestTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.serviceRequests
  },
  projection: { serviceRequests: true }
})
