const { schemaComposer } = require('graphql-compose')
const ItemAttribute = require('../../../models/itemAttribute')

// reimplement creation of an order
const ServiceTC = schemaComposer.getOTC('Service')
const oldResolver = ServiceTC.getResolver('createOne')
ServiceTC.addResolver({
  ...oldResolver,
  name: 'createNew',
  resolve: async ({ source, args, context, info }) => {
    if (Array.isArray(args.record.attributes) &&
        args.record.attributes.length > 0) {
      // create item attribute documents out of the attribute data
      args.record.attributes = await ItemAttribute.createManyFromAttributeData(args.record.attributes)
    }
    const result = await ServiceTC.getResolver('createOne')
      .resolve({ source, args, context, info })
    return result
  }
})

// apply changes made to the resolver
schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createNew')
})
