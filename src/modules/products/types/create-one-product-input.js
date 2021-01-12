const { schemaComposer } = require('graphql-compose')
const ProductTC = schemaComposer.getOTC('Product')

// modify product input.variants
// to instead accept an array of variant data
schemaComposer.getITC('VariantAttributeDataInput')
  .setFields({
    attribute: 'String!', // of attribyte code
    option: 'String!' // of option code
  })

schemaComposer.getITC('CreateOneProductInput')
  .removeField(['attributes', 'variants'])
  .addFields({
    attributes: '[ItemAttributeInput]',
    variants: '[VariantInput]'
  })

schemaComposer.Mutation.addFields({
  createOneProduct: ProductTC.getResolver('createOne')
})
