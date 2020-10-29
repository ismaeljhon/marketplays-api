const mongoose = require('mongoose')
const User = require('../../../models/user')

const hooks = {
  post: {
    save: async (department, next) => {
      // add department to user teamLead of
      // @TODO - add check if adding a department to a user fails
      await User.updateOne(
        { _id: department.teamLead },
        { $push: { teamLeadOf: department._id } }
      )
      next()
    }
  },
  pre: {
    save: function (next) {
      // delete department under old teamLead
      // if trying to update team lead
      return this.constructor.findById(this._id).exec()
        .then(department => {
          if (department && department.teamLead) {
            mongoose.models['User'].updateOne(
              { _id: department.teamLead._id },
              { $pull: { teamLeadOf: department._id } }
            ).exec()
          }
        })
    }
  }
}

module.exports = hooks
