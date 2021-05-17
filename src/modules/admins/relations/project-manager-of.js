const { schemaComposer } = require('graphql-compose')

const AdminTC = schemaComposer.getOTC('Admin')
const ServiceTC = schemaComposer.getOTC('Service')

AdminTC.addRelation('projectManagerOf', {
  resolver: () => ServiceTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.projectManagerOf
  },
  projection: { projectManagerOf: true }
})
