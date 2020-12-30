const { schemaComposer } = require('graphql-compose')
const ServiceTC = schemaComposer.getOTC('Service')

schemaComposer.getITC('CreateOneServiceInput')
  .removeField(['attributes', 'variants'])
  .addFields({
    attributes: '[AttributeInput]',
    variants: '[VariantInput]'
  })

schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createOne')
})
