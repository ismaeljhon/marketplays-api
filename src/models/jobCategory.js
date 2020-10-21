const mongoose = require('mongoose')

const jobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  seoTitle: {
    type: String
  },
  seoKeywords: {
    type: String
  },
  seoDescription: {
    type: String
  }
})

const JobCategory = mongoose.model('JobCategory', jobCategorySchema)

module.exports = JobCategory
