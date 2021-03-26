const { schemaComposer } = require('graphql-compose')

// // add types for signup
// schemaComposer.createInputTC({
//   name: 'SignupUserInput',
//   fields: {
//     firstName: 'String!',
//     middleName: 'String!',
//     lastName: 'String!',
//     email: 'String!',
//     password: 'String!'

//   }
// })

schemaComposer.createInputTC({
  name: 'SignupVendorUserInput',
  fields: {
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    email: 'String!',
    password: 'String!',
    contactNumber: 'String!',
    businessName: 'String!',
    street: 'String!',
    city: 'String!',
    state: 'String!',
    countryCode: 'String!',
    zipCode: 'String!',
    timeAvailability: 'String!',
    validId: 'String!',
    validIdWithSelfie: 'String!'
  }
})
