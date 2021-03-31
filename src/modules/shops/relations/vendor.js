/*
-- do not implement for now--
const { schemaComposer } = require('graphql-compose')

const ShopTC = schemaComposer.getOTC('Shop')
const VendorTC = schemaComposer.getOTC('Vendor')

ShopTC.addRelation('ownBy', {
  resolver: () => VendorTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.ownBy
  },
  projection: { ownBy: true }
})
*/
