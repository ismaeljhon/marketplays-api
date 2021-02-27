const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (category, next) => {
      // add category to user teamlead of;

      const User = mongoose.models['User']
      await User.updateOne(
        { _id: category.teamLead },
        { $push: { teamLeadOf: category._id } }
      )

      // add category to services;
      const Service = mongoose.models['Service']
      const serviceIds = category.services
      serviceIds.forEach(async (serviceId) => {
        // @TODO - compare 2 arrays first and determine what services needs to have its department updated
        await Service.updateOne(
          { _id: serviceId },
          { $set: { category: category._id } }
        )
      })
      next()
    }
  },
  pre: {
    save: async function (next) {
      // delete category under old teamLead
      // if trying to update team lead
      const Category = mongoose.models['Category']
      const User = mongoose.models['User']
      const Service = mongoose.models['Service']
      const category = await Category.findById(this._id)
      if (category) {
        if (category.teamLead) {
          await User.updateOne(
            { _id: category.teamLead._id },
            { $pull: { teamLeadOf: category._id } }
          )
        }

        // delete category on old services
        if (category.services && this.services.length > 0) {
          // @TODO - compare 2 arrays first and determine what services needs to have its department deleted
          category.services.forEach(async (serviceId) => {
            await Service.updateOne(
              { _id: serviceId },
              { $unset: { category: '' } }
            )
          })
        }
      }
      return next()
    }
  }
}

module.exports = hooks
