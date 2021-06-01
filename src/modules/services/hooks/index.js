const mongoose = require('mongoose')
const slugify = require('slugify')
const { isEmpty } = require('lodash')
const hooks = {
  post: {
    save: async (service, next) => {
      // add service under category
      const Category = mongoose.models['Category']
      await Category.updateOne({ _id: service.category }, {
        $push: { services: service._id }
      })

      // add service under the department
      // @TODO - add check if adding a service to a department fails
      const Department = mongoose.models['Department']
      await Department.updateOne(
        { _id: service.department },
        { $push: { services: service._id } }
      )

      // add service under project manager
      const User = mongoose.models['User']
      await User.updateOne(
        { _id: service.projectManager },
        { $push: { projectManagerOf: service._id } }
      )

      // add service under itemAttribute, if applicable
      if (service.attributes) {
        const ItemAttribute = mongoose.models['ItemAttribute']
        await ItemAttribute.updateMany(
          { _id: { $in: service.attributes } },
          { $set: { service: service._id } }
        )
      }

      // add variants under the service
      if (service.variants) {
        const Variant = mongoose.models['Variant']
        await Variant.updateMany(
          { _id: { $in: service.variants } },
          { $set: { service: service._id } }
        )
      }

      // fix issue slug;
      if (isEmpty(service.slug)) {
        service.slug = slugify(service.name)
      }

      next()
    }
  },
  pre: {
    save: async function (next) {
      // check if department of project manager is set
      // (including null)
      if (typeof this.department !== 'undefined' ||
        typeof this.projectManager !== 'undefined') {
        const Department = mongoose.models['Department']
        const Category = mongoose.models['Category']
        const Service = mongoose.models['Service']
        const User = mongoose.models['User']
        const service = await Service.findById(this._id)

        if (service) {
          let oldProjectManager = service.projectManager

          if (service.category) {
            // delete service under old category

            const oldCategory = await Category.updateOne(
              { _id: service.category },
              { $pull: { services: service._id } }
            )

            // if no old projectManager has been set
            // the old projectManager is the category teamLead
            if (oldProjectManager === null) {
              oldProjectManager = oldCategory.teamLead
            }
          }

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
