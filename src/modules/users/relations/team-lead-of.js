const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const DepartmentTC = schemaComposer.getOTC('Department')

UserTC.addRelation('teamLeadOf', {
  resolver: () => DepartmentTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})
