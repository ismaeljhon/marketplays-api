const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const FileTC = schemaComposer.getOTC('File')

ServiceTC.addRelation('images', {
  resolver: () => FileTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.images
  },
  projection: { images: true }
})
