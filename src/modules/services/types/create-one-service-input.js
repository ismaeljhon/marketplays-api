const { schemaComposer } = require('graphql-compose')
const ServiceTC = schemaComposer.getOTC('Service')

// modify service input.attribute
// to instead accept an array of attribute data
schemaComposer.createInputTC({
  name: 'AttributeInput',
  fields: {
    name: 'String',
    options: '[String]'
  }
})

// modify service input.variants
// to instead accept an array of variant data
schemaComposer.getITC('VariantAttributeDataInput')
  .setFields({
    attribute: 'String!',
    option: 'String!'
  })

schemaComposer.createInputTC({
  name: 'VariantInput',
  fields: {
    name: 'String!',
    description: 'String',
    pricing: 'Float!',
    attributeData: '[VariantAttributeDataInput]'
  }
})

schemaComposer.getITC('CreateOneServiceInput')
  .removeField(['attributes', 'variants'])
  .addFields({
    attributes: '[AttributeInput]',
    variants: '[VariantInput]'
  })

schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createOne')
})
