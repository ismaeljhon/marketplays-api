const { schemaComposer } = require('graphql-compose')
schemaComposer.createObjectTC({
  name: 'UserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})

schemaComposer.createObjectTC({
  name: 'VendorUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})

schemaComposer.createObjectTC({
  name: 'AdminUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})

schemaComposer.createObjectTC({
  name: 'TFPUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})

schemaComposer.createObjectTC({
  name: 'CustomerUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})
