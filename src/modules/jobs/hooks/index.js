const mongoose = require('mongoose')

const hooks = {
  post: {
    save: async (job, next) => {
      // add job to service request
      const ServiceRequest = mongoose.models['ServiceRequest']
      await ServiceRequest.updateOne(
        { _id: job.serviceRequest },
        { $push: { jobs: job._id } }
      )
      next()
    }
  }
}

module.exports = hooks
