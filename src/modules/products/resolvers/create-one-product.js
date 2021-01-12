const { schemaComposer } = require('graphql-compose')
const Product = require('../../../models/product')

const ProductTC = schemaComposer.getOTC('Product')
schemaComposer.Mutation.addFields({
  // prepare args before item will be created
  // @TODO - calling this via Product model
  // but the (static) method is defined at (base) Item model
  // making this call via Item model directly doesn't work for some reason
  createOneProduct: ProductTC.getResolver('createOne')
    .wrapResolve(next => async (rp) => {
      return Product.prepareArgs(rp.args)
        .then(args => {
          rp.args = args
          return next(rp)
        })
    })
})
