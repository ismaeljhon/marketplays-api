const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const ServiceTC = schemaComposer.getOTC('Service')

UserTC.addRelation('projectManagerOf', {
  resolver: () => ServiceTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.projectManagerOf
  },
  projection: { projectManagerOf: true }
})
