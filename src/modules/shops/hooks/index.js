/* const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (shop, next) => {
      const Vendor = mongoose.models['Vendor']
      await Vendor.updateOne(
        { _id: shop.ownBy },
        { $push: { shops: shop._id } }
      )
      next()
    }
  },
  pre: {
    save: async function (next) {
      const Shop = mongoose.models['Shop']
      const Vendor = mongoose.models['Vendor']
      const shop = await Shop.findById(this._id)
      if (shop) {
        if (shop.ownBy) {
          await Vendor.updateOne(
            { _id: shop.ownBy._id },
            { $pull: { shops: shop._id } }
          )
        }
      }
      return next()
    }
  }
}

module.exports = hooks
*/
