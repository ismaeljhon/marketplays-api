const { schemaComposer } = require('graphql-compose')

// define types to be shared across subtypes
schemaComposer.createInputTC({
  name: 'AttributeOptionInput',
  fields: {
    name: 'String!',
    code: 'String!'
  }
})
schemaComposer.createInputTC({
  name: 'AttributeInput',
  fields: {
    name: 'String!',
    code: 'String!'
  }
})
schemaComposer.createInputTC({
  name: 'ItemAttributeInput',
  fields: {
    attribute: 'AttributeInput!',
    options: '[AttributeOptionInput!]!'
  }
})
