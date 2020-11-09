const { schemaComposer } = require('graphql-compose')
const Order = require('../../../models/order')

// reimplement creation of an order
const OrderTC = schemaComposer.getOTC('Order')
OrderTC.getResolver('createOne')
  .setResolve(async ({ source, args }) => {
    const order = await Order.createNew(args.record)
    return {
      recordId: order._id,
      record: order
    }
  })

// apply changes made to the resolver
schemaComposer.Mutation.addFields({
  createOneOrder: OrderTC.getResolver('createOne')
})
