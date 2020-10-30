const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (department, next) => {
      // add department to user teamLead of
      // @TODO - add check if adding a department to a user fails
      const User = mongoose.models['User']
      await User.updateOne(
        { _id: department.teamLead },
        { $push: { teamLeadOf: department._id } }
      )

      // add department to services
      const Service = mongoose.models['Service']
      const serviceIds = department.services
      serviceIds.forEach(async serviceId => {
      // @TODO - compare 2 arrays first and determine what services needs to have its department updated
        await Service.updateOne(
          { _id: serviceId },
          { $set: { department: department._id } }
        )
      })
      next()
    }
  },
  pre: {
    save: async function (next) {
      // delete department under old teamLead
      // if trying to update team lead
      const Department = mongoose.models['Department']
      const User = mongoose.models['User']
      const Service = mongoose.models['Service']
      const department = await Department.findById(this._id)
      if (department) {
        if (department.teamLead) {
          await User.updateOne(
            { _id: department.teamLead._id },
            { $pull: { teamLeadOf: department._id } }
          )
        }

        // delete department on old services
        if (department.services && this.services.length > 0) {
          // @TODO - compare 2 arrays first and determine what services needs to have its department deleted
          department.services.forEach(async serviceId => {
            await Service.updateOne(
              { _id: serviceId },
              { $unset: { department: '' } }
            )
          })
        }
      }
      return next()
    }
  }
}

module.exports = hooks
