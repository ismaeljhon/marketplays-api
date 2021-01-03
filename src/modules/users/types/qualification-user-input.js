const { schemaComposer } = require('graphql-compose')

// add types for signup
schemaComposer.createInputTC({
  name: 'QualificationUserInput',
  fields: {
    qualificationID: 'String!',
    userID: 'String!'
  }
})
