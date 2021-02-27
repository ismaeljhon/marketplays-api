const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const CategoryTC = schemaComposer.getOTC('Category')

ServiceTC.addRelation('category', {
  resolver: () => CategoryTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: true }
})
