const { schemaComposer } = require('graphql-compose')
schemaComposer.createObjectTC({
  name: 'UserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})
