const { schemaComposer } = require('graphql-compose')

const SubscriptionTC = schemaComposer.getOTC('Subscription')
const ServiceTC = schemaComposer.getOTC('Service')

SubscriptionTC.addRelation('services', {
  resolver: () => ServiceTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.services
  },
  projection: { services: true }
})
