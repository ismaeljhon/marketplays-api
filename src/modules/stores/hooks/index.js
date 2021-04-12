const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (store, next) => {
      const Vendor = mongoose.models['Vendor']
      await Vendor.updateOne(
        { _id: store.ownBy },
        { $push: { stores: store._id } }
      )
      next()
    }
  },
  pre: {
    save: async function (next) {
      const Store = mongoose.models['Store']
      const Vendor = mongoose.models['Vendor']
      const store = await Store.findById(this._id)
      if (store) {
        if (store.ownBy) {
          await Vendor.updateOne(
            { _id: store.ownBy._id },
            { $pull: { stores: store._id } }
          )
        }
      }
      return next()
    }
  }
}

module.exports = hooks
