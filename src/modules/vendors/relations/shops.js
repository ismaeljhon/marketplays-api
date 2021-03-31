/*
 -- do not implement for now --
const { schemaComposer } = require('graphql-compose')
const VendorTC = schemaComposer.getOTC('Vendor')
const ShopTC = schemaComposer.getOTC('Shop')

VendorTC.addRelation('shops', {
  resolver: () => ShopTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.shops
  },
  projection: { shops: true }
})

*/
