const { schemaComposer } = require('graphql-compose')
const ServiceTC = schemaComposer.getOTC('Service')

// modify service input.variants
// to instead accept an array of variant data
schemaComposer.getITC('VariantAttributeDataInput')
  .setFields({
    attribute: 'String!', // of attribyte code
    option: 'String!' // of option code
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
