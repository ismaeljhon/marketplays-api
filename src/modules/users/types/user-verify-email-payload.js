const { schemaComposer } = require('graphql-compose')

// define payload response type for verifying a user
schemaComposer.createObjectTC({
  name: 'UserVerifyEmailRecord',
  fields: {
    email: 'String',
    emailVerified: 'Boolean'
  }
})
schemaComposer.createObjectTC({
  name: 'UserVerifyEmailPayload',
  fields: {
    record: 'UserVerifyEmailRecord'
  }
})
