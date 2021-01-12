const { schemaComposer } = require('graphql-compose')
const Service = require('../../../models/service')

const ServiceTC = schemaComposer.getOTC('Service')
schemaComposer.Mutation.addFields({
  // prepare args before item will be created
  // @TODO - calling this via Service model
  // but the (static) method is defined at (base) Item model
  // making this call via Item model directly doesn't work for some reason
  createOneService: ServiceTC.getResolver('createOne')
    .wrapResolve(next => async (rp) => {
      return Service.prepareArgs(rp.args)
        .then(args => {
          rp.args = args
          return next(rp)
        })
    })
})
