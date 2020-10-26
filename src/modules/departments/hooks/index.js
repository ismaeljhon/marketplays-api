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
  }
}

module.exports = hooks
