const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (shop, next) => {
      const User = mongoose.models['User']
      await User.updateOne(
        { _id: shop.ownBy },
        { $push: { shops: shop._id } }
      )
      next()
    }
  },
  pre: {
    save: async function (next) {
      const Shop = mongoose.models['Shop']
      const User = mongoose.models['User']
      const shop = await Shop.findById(this._id)
      if (shop) {
        if (shop.ownBy) {
          await User.updateOne(
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
