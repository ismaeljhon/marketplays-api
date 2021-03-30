const { schemaComposer } = require('graphql-compose')

schemaComposer.createInputTC({
  name: 'SignupVendorUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!',
    phoneNumber: 'String!',
    businessName: 'String!',
    businessAddress: 'String!',
    dateTimeForVerification: 'Date!',
    hasExistingMarketplaysPlatform: 'Boolean!',
    validId: 'String!',
    validIdWithSelfie: 'String!'
  }
})
