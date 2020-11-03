const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const UserTC = schemaComposer.getOTC('User')

ServiceTC.addRelation('projectManager', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.projectManager
  },
  projection: { projectManager: true }
})
