const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'SignupUserInput',
  fields: {
    firstName: 'String!',
    lastName: 'String!',
    username: 'String!',
    email: 'String!',
    password: 'String!',
    mentor: 'String!',
    skills: '[String]!',
    knowledge: '[String]!'
  }
})
