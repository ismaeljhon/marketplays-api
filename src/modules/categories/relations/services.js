const { schemaComposer } = require('graphql-compose')

const CategoryTC = schemaComposer.getOTC('Category')
const ServiceTC = schemaComposer.getOTC('Service')

CategoryTC.addRelation('services', {
  resolver: () => ServiceTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.services
  },
  projection: { services: true }
})
