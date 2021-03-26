const { schemaComposer } = require('graphql-compose')

const UserTC = schemaComposer.getOTC('User')
const DepartmentTC = schemaComposer.getOTC('Department')
const CategoryTC = schemaComposer.getOTC('Category')
// todo move in admin;
UserTC.addRelation('teamLeadOf', {
  resolver: () => DepartmentTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})

UserTC.addRelation('catTeamLeadOf', {
  resolver: () => CategoryTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})
