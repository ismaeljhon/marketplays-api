const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'UserVerifyEmailInput',
  fields: {
    code: 'String!'
  }
})
