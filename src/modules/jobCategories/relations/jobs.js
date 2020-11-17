const { schemaComposer } = require('graphql-compose')

const JobCategoryTC = schemaComposer.getOTC('JobCategory')
const JobTC = schemaComposer.getOTC('Job')

JobCategoryTC.addRelation('jobs', {
  resolver: () => JobTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.jobs
  },
  projection: { jobs: true }
})
