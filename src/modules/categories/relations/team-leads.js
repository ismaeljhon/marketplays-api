const { schemaComposer } = require('graphql-compose')

const CategoryTC = schemaComposer.getOTC('Category')
const UserTC = schemaComposer.getOTC('User')

CategoryTC.addRelation('teamLead', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.teamLead
  },
  projection: { teamLead: true }
})
