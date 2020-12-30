const { schemaComposer } = require('graphql-compose')

schemaComposer.getITC('UpdateByIdServiceInput')
  .removeField(['attributes', 'variants'])
  .addFields({
    attributes: '[AttributeInput]',
    variants: '[VariantInput]'
  })
