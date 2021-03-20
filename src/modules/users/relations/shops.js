const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const ShopTC = schemaComposer.getOTC('Shop')

UserTC.addRelation('shops', {
  resolver: () => ShopTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.shops
  },
  projection: { shops: true }
})
