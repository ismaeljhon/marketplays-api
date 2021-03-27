const { schemaComposer } = require('graphql-compose')

const AdminTC = schemaComposer.getOTC('Admin')
const DepartmentTC = schemaComposer.getOTC('Department')
const CategoryTC = schemaComposer.getOTC('Category')
// todo move in admin;
AdminTC.addRelation('teamLeadOf', {
  resolver: () => DepartmentTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})

AdminTC.addRelation('catTeamLeadOf', {
  resolver: () => CategoryTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})
