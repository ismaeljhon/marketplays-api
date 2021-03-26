const { schemaComposer } = require('graphql-compose')
const VendorTC = schemaComposer.getOTC('Vendor')
const ShopTC = schemaComposer.getOTC('Shop')

VendorTC.addRelation('shop', {
  resolver: () => ShopTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.shop
  },
  projection: { shop: true }
})
