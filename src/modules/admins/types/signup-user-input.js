const { schemaComposer } = require('graphql-compose')

schemaComposer.createInputTC({
  name: 'SignupAdminUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!',
    contactNumber: 'String!',
    teamLeadOf: '[MongoID]',
    projectManagerOf: '[MongoID]'
  }
})
