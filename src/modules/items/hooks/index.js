const mongoose = require('mongoose')

// hooks that will be executed of all discriminator models
// with Items as their base model
const hooks = {
  post: {
    save: async (item, next) => {
      // add item under itemAttribute, if applicable
      if (item.attributes) {
        const ItemAttribute = mongoose.model('ItemAttribute')
        await ItemAttribute.updateMany(
          { _id: { $in: item.attributes } },
          { $set: { item: item._id } }
        )
      }

      // add variants under the item
      if (item.variants) {
        const Variant = mongoose.model('Variant')
        await Variant.updateMany(
          { _id: { $in: item.variants } },
          { $set: { item: item._id } }
        )
      }
      next()
    }
  }
}

module.exports = hooks
