const { schemaComposer } = require('graphql-compose')
const ServiceTC = schemaComposer.getOTC('Service')

// modify service input.attribute
// to instead accept a hashref of attribute data
schemaComposer.createInputTC({
  name: 'AttributeInput',
  fields: {
    name: 'String',
    options: '[String]'
  }
})

schemaComposer.getITC('CreateOneServiceInput')
  .removeField(['attributes'])
  .addFields({
    attributes: '[AttributeInput]'
  })
schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createOne')
})
