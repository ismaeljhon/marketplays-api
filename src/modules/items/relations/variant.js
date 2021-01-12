const { schemaComposer } = require('graphql-compose')

const ItemTC = schemaComposer.getOTC('Item')
const VariantTC = schemaComposer.getOTC('Variant')

ItemTC.addRelation('variants', {
  resolver: () => VariantTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.variants
  },
  projection: { variants: true }
})
