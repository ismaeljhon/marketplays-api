const { schemaComposer } = require('graphql-compose')

const DepartmentTC = schemaComposer.getOTC('Department')
const UserTC = schemaComposer.getOTC('User')

DepartmentTC.addRelation('teamLead', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.teamLead
  },
  projection: { teamLead: true }
})
