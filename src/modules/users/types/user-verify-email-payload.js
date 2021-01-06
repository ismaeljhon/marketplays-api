const { schemaComposer } = require('graphql-compose')
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
