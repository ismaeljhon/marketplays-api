const { schemaComposer } = require('graphql-compose')

const ServiceTC = schemaComposer.getOTC('Service')
const DepartmentTC = schemaComposer.getOTC('Department')

ServiceTC.addRelation('department', {
  resolver: () => DepartmentTC.getResolver('findById'),
  prepareArgs: {
    _id: (source) => source.department
  },
  projection: { department: true }
})
