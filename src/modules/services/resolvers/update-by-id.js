const { schemaComposer } = require('graphql-compose')
const ItemAttribute = require('../../../models/itemAttribute')
const Variant = require('../../../models/variant')

// reimplement updating a service by id
const ServiceTC = schemaComposer.getOTC('Service')
const oldResolver = ServiceTC.getResolver('updateById')
ServiceTC.addResolver({
  ...oldResolver,
  name: 'customUpdateById',
  resolve: async ({ source, args, context, info }) => {
    if (Array.isArray(args.record.attributes) &&
        args.record.attributes.length > 0) {
      // create item attribute documents out of the attribute data
      args.record.attributes = await ItemAttribute.createManyFromAttributeData(args.record.attributes)
      if (Array.isArray(args.record.variants) &&
          args.record.variants.length > 0) {
        args.record.variants = await Variant.validateAndCreateMany(args.record.variants, args.record.attributes)
      }
    }
    const result = await ServiceTC.getResolver('updateById')
      .resolve({ source, args, context, info })
    return result
  }
})

// apply changes made to the resolver
schemaComposer.Mutation.addFields({
  updateServiceById: ServiceTC.getResolver('customUpdateById')
})
