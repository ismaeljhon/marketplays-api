const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (service, next) => {
      // add service under the department
      // @TODO - add check if adding a service to a department fails
      const Department = mongoose.models['Department']
      await Department.updateOne(
        { _id: service.department },
        { $push: { services: service._id } }
      )
      next()
    }
  },
  pre: {
    save: async function (next) {
      // delete service under old department
      // if trying to update team lead
      const Department = mongoose.models['Department']
      const Service = mongoose.models['Service']
      const service = await Service.findById(this._id)
      if (service && service.department) {
        await Department.updateOne(
          { _id: service.department },
          { $pull: { services: service._id } }
        )
      }
      return next()
    }
  }
}

module.exports = hooks
