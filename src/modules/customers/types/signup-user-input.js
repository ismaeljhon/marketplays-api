const { schemaComposer } = require('graphql-compose')

schemaComposer.createInputTC({
  name: 'SignupCustomerUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!'
  }
})
