const { schemaComposer } = require('graphql-compose')
const ItemAttribute = require('../../../models/itemAttribute')
const Variant = require('../../../models/variant')

// reimplement creation of an order
const ServiceTC = schemaComposer.getOTC('Service')
const oldResolver = ServiceTC.getResolver('createOne')
ServiceTC.addResolver({
  ...oldResolver,
  name: 'createNew',
  resolve: async ({ source, args, context, info }) => {
    // create variants, if applicable
    // only create item attributes if attributes AND variants are provided
    // @TODO - abstract this to the model?
    if (Array.isArray(args.record.attributes) && args.record.attributes.length > 0 &&
        Array.isArray(args.record.variants) && args.record.variants.length > 0) {
      // since the schema for creating a service requies that the attributes and variants fields
      // are of ObjectID, the values will become null at `create` method level.
      // case in point, we need to create them first out of the input data
      // then update the payload to reflect the IDs
      return ItemAttribute.createManyFromAttributeData(args.record.attributes)
        .then(result => {
          args.record.attributes = result
          return Variant.validateAndCreateMany(args.record.variants, args.record.attributes)
            .then(result => {
              args.record.variants = result
              return ServiceTC.getResolver('createOne')
                .resolve({ source, args, context, info })
            })
            .catch((error) => {
              throw error
            })
        })
        .catch(error => {
          throw error
        })
    } else {
      // make sure when creating a standard product,
      // no attributes or variants will be added
      args.record.attributes = args.record.variants = []
      return ServiceTC.getResolver('createOne')
        .resolve({ source, args, context, info })
    }
  }
})

// apply changes made to the resolver
schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createNew')
})
