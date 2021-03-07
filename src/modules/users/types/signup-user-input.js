const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'SignupUserInput',
  fields: {
    fullName: 'String!',
    email: 'String!',
    password: 'String!',
    isEcommerce: 'Boolean',
    isFTP: 'Boolean',
    isSocialMedia: 'Boolean'
  }
})
