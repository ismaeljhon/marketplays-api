const { schemaComposer } = require('graphql-compose')
schemaComposer.createObjectTC({
  name: 'VerifyPayload',
  fields: {
    recordId: 'MongoID',
    record: 'Boolean',
    error: 'ErrorInterface'
  }
})
