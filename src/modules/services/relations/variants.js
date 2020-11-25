const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const VariantTC = schemaComposer.getOTC('Variant')

ServiceTC.addRelation('variants', {
  resolver: () => VariantTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.variants
  },
  projection: { variants: true }
})
