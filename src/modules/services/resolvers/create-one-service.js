const { schemaComposer } = require('graphql-compose')
const Service = require('../../../models/service')

// reimplement creation of a service
const ServiceTC = schemaComposer.getOTC('Service')
const oldResolver = ServiceTC.getResolver('createOne')
ServiceTC.addResolver({
  ...oldResolver,
  name: 'createNew',
  resolve: async ({ source, args, context, info }) => {
    // prepare args
    // @TODO - calling this via Service model
    // but the (static) method is defined at (base) Item model
    // making this call via Item model directly doesn't work for some reason
    return Service.prepareArgs(args)
      .then(args => {
        return ServiceTC.getResolver('createOne')
          .resolve({ source, args, context, info })
      })
      .catch(error => {
        throw error
      })
  }
})

// apply changes made to the resolver
schemaComposer.Mutation.addFields({
  createOneService: ServiceTC.getResolver('createNew')
})
