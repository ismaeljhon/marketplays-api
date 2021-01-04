const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const QualificationTC = schemaComposer.getOTC('Qualification')

UserTC.addRelation('skills', {
  resolver: () => QualificationTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.skills
  },
  projection: { skills: true }
})
