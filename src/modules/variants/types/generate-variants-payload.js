const { schemaComposer } = require('graphql-compose')

// object type to represent a single generated variant
schemaComposer.createObjectTC({
  name: 'GeneratedVariantAttributeDataAttribute',
  fields: {
    name: 'String'
  }
})
schemaComposer.createObjectTC({
  name: 'GeneratedVariantAttributeDataOption',
  fields: {
    name: 'String'
  }
})
schemaComposer.createObjectTC({
  name: 'GeneratedVariantAttributeData',
  fields: {
    attribute: 'GeneratedVariantAttributeDataAttribute',
    option: 'GeneratedVariantAttributeDataOption'
  }
})
const GeneratedVariant = schemaComposer.createObjectTC({
  name: 'GeneratedVariant',
  fields: {
    name: 'String',
    attributeData: '[GeneratedVariantAttributeData]'
  }
})
const GeneratedVariants = schemaComposer.createObjectTC({
  name: 'GeneratedVariants',
  fields: {
    variants: [GeneratedVariant]
  }
})

schemaComposer.createObjectTC({
  name: 'GenerateVariantsPayload',
  fields: {
    record: GeneratedVariants
  }
})
