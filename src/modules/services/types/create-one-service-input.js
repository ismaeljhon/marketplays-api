const { schemaComposer } = require('graphql-compose')
const ServiceTC = schemaComposer.getOTC('Service')

// modify service input.attribute
// to instead accept an array of attribute data
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

// modify service input.variants
// to instead accept an array of variant data
schemaComposer.getITC('VariantAttributeDataInput')
  .setFields({
    attribute: 'String!', // of attribyte code
    option: 'String!' // of option code
  })

schemaComposer.createInputTC({
  name: 'VariantInput',
  fields: {
    name: 'String!',
    code: 'String!',
    description: 'String',
    price: 'Float!',
    attributeData: '[VariantAttributeDataInput]'
  }
})

schemaComposer.getITC('CreateOneServiceInput')
  .removeField(['attributes', 'variants'])
  .addFields({
    attributes: '[ItemAttributeInput]',
    variants: '[VariantInput]'
  })

schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createOne')
})
