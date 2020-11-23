const { schemaComposer } = require('graphql-compose')

// add types for generating variants
schemaComposer.createInputTC({
  name: 'GenerateVariantsAttributeDataInput',
  fields: {
    attribute: 'String',
    options: '[String]'
  }
})

schemaComposer.createInputTC({
  name: 'GenerateVariantsInput',
  fields: {
    attributeData: '[GenerateVariantsAttributeDataInput]'
  }
})
