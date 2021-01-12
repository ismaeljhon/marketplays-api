const { schemaComposer } = require('graphql-compose')

const ProductTC = schemaComposer.getOTC('Product')
const VariantTC = schemaComposer.getOTC('Variant')

ProductTC.addRelation('variants', {
  resolver: () => VariantTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.variants
  },
  projection: { variants: true }
})
