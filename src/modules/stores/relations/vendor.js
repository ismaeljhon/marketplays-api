const { schemaComposer } = require('graphql-compose')

const StoreTC = schemaComposer.getOTC('Store')
const VendorTC = schemaComposer.getOTC('Vendor')

StoreTC.addRelation('ownBy', {
  resolver: () => VendorTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.ownBy
  },
  projection: { ownBy: true }
})
