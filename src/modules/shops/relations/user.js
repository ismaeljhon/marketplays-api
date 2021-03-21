const { schemaComposer } = require('graphql-compose')

const ShopTC = schemaComposer.getOTC('Shop')
const UserTC = schemaComposer.getOTC('User')

ShopTC.addRelation('ownBy', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.ownBy
  },
  projection: { ownBy: true }
})
