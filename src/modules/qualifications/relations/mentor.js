const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')

UserTC.addRelation('mentor', {
  resolver: () => UserTC.getResolver('dataLoader'),
  prepareArgs: {
    _ids: (source) => source.mentor
  },
  projection: { mentor: true }
})
