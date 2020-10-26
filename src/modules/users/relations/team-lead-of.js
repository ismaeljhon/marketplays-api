const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')

UserTC.addRelation('teamLeadOf', {
  resolver: () => UserTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})
