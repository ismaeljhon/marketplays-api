const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const QualificationTC = schemaComposer.getOTC('Qualification')

UserTC.addRelation('knowledge', {
  resolver: () => QualificationTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.knowledge
  },
  projection: { knowledge: true }
})
