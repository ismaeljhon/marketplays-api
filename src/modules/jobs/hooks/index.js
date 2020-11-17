const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (job, next) => {
      // add job to service request
      const ServiceRequest = mongoose.models['ServiceRequest']
      const JobCategory = mongoose.models['JobCategory']
      await ServiceRequest.updateOne(
        { _id: job.serviceRequest },
        { $push: { jobs: job._id } }
      )

      // add job to category
      await JobCategory.updateOne(
        { _id: job.category },
        { $push: { jobs: job._id } }
      )
      next()
    }
  }
}

module.exports = hooks
