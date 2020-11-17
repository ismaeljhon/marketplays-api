const mongoose = require('mongoose')
const Schema = require('mongoose')

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
  },
  jobs: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = jobCategorySchema
