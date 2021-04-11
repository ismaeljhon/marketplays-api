const { schemaComposer } = require('graphql-compose')
const VendorTC = schemaComposer.getOTC('Vendor')
const StoreTC = schemaComposer.getOTC('Store')

VendorTC.addRelation('stores', {
  resolver: () => StoreTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.stores
  },
  projection: { stores: true }
})
