const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (service, next) => {
      // add service under the department
      // @TODO - add check if adding a service to a department fails
      const Department = mongoose.model('Department')
      await Department.updateOne(
        { _id: service.department },
        { $push: { services: service._id } }
      )

      // add service under project manager
      const User = mongoose.model('User')
      await User.updateOne(
        { _id: service.projectManager },
        { $push: { projectManagerOf: service._id } }
      )
      next()
    }
  },
  pre: {
    save: async function (next) {
      // check if department of project manager is set
      // (including null)
      if (typeof this.department !== 'undefined' ||
          typeof this.projectManager !== 'undefined') {
        const Department = mongoose.model('Department')
        const Service = mongoose.model('Service')
        const User = mongoose.model('User')
        const service = await Service.findById(this._id)

        if (service) {
          let oldProjectManager = service.projectManager
          if (service.department) {
            // delete service under old department
            // if trying to update team lead
            const oldDepartment = await Department.updateOne(
              { _id: service.department },
              { $pull: { services: service._id } }
            )

            // if no old projectManager has been set
            // the old projectManager is the department teamLead
            if (oldProjectManager === null) {
              oldProjectManager = oldDepartment.teamLead
            }
          }

          if (oldProjectManager) {
            await User.updateOne(
              { _id: oldProjectManager },
              { $pull: { projectManagerOf: service._id } }
            )
          }
        }

        // if project manager is set to be removed,
        // set the project manager to be the department's team lead
        if (this.projectManager === null && this.department !== null) {
          const department = await Department.findById(this.department)
          this.projectManager = department.teamLead
        }
      }
      return next()
    }
  }
}

module.exports = hooks
