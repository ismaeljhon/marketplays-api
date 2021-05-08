const { schemaComposer } = require('graphql-compose')

const ProductTC = schemaComposer.getOTC('Product')
const FileTC = schemaComposer.getOTC('File')

ProductTC.addRelation('images', {
  resolver: () => FileTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.images
  },
  projection: { images: true }
})
