const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'SignupUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!',
    contactNumber: 'String!'

  }
})
/*

schemaComposer.createInputTC({
  name: 'SignupAdminUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!'

  }
})

schemaComposer.createInputTC({
  name: 'SignupTFPUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!'
  }
})

*/
