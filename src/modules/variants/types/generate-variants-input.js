const { schemaComposer } = require('graphql-compose')

// add types for generating variants
schemaComposer.createInputTC({
  name: 'GenerateVariantsAttributeDataInput',
  fields: {
    name: 'String!',
    code: 'String!'
  }
})
schemaComposer.createInputTC({
  name: 'GenerateVariantsOptionDataInput',
  fields: {
    name: 'String!',
    code: 'String!'
  }
})
schemaComposer.createInputTC({
  name: 'GenerateVariantsItemAttributeDataInput',
  fields: {
    attribute: 'GenerateVariantsAttributeDataInput',
    options: '[GenerateVariantsOptionDataInput]'
  }
})

schemaComposer.createInputTC({
  name: 'GenerateVariantsInput',
  fields: {
    attributeData: '[GenerateVariantsItemAttributeDataInput]'
  }
})
