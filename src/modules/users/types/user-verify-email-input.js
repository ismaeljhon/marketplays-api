const { schemaComposer } = require('graphql-compose')

// add input type for verifying a user
schemaComposer.createInputTC({
  name: 'UserVerifyEmailInput',
  fields: {
    code: 'String!'
  }
})
