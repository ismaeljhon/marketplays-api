const { schemaComposer } = require('graphql-compose')

const DepartmentTC = schemaComposer.getOTC('Department')
const ServiceTC = schemaComposer.getOTC('Service')

DepartmentTC.addRelation('services', {
  resolver: () => ServiceTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.services
  },
  projection: { services: true }
})
