const { schemaComposer } = require('graphql-compose')

const ServiceRequestTC = schemaComposer.getOTC('ServiceRequest')
const JobTC = schemaComposer.getOTC('Job')

ServiceRequestTC.addRelation('jobs', {
  resolver: () => JobTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.jobs
  },
  projection: { jobs: true }
})
