const { schemaComposer } = require('graphql-compose')

const AdminTC = schemaComposer.getOTC('Admin')
const CategoryTC = schemaComposer.getOTC('Category')
// todo move in admin;
AdminTC.addRelation('teamLeadOf', {
  resolver: () => CategoryTC.getResolver('dataLoaderMany'),
  prepareArgs: {
    _ids: (source) => source.teamLeadOf
  },
  projection: { teamLeadOf: true }
})
