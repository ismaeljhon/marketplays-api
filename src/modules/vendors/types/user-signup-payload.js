const { schemaComposer } = require('graphql-compose')

// schemaComposer.createObjectTC({
//   name: 'VendorUserSignupPayload',
//   fields: {
//     recordId: 'MongoID',
//     record: 'User',
//     error: 'ErrorInterface'
//   }
// })

schemaComposer.createObjectTC({
  name: 'VendorUserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})
