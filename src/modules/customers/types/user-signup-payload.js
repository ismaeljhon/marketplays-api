const { schemaComposer } = require('graphql-compose')

schemaComposer.createObjectTC({
  name: 'CustomerUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})
