const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const QualificationTC = schemaComposer.getOTC('Qualification')

QualificationTC.addRelation('users', {
  resolver: () => UserTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.users
  },
  projection: { users: true }
})
