const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'SignupUserInput',
  fields: {
    first_name: 'String!',
    last_name: 'String!',
    username: 'String!',
    email: 'String!',
    password: 'String!',
    mentorID: 'String!',
    skills: '[String]',
    knowledge: '[String]'
  }
})
