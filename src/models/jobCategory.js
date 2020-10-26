const mongoose = require('mongoose')
const generateModel = require('../utils/generate-model')

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

const JobCategory = generateModel('JobCategory', jobCategorySchema)

module.exports = JobCategory
