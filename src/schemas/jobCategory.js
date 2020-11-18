const mongoose = require('mongoose')
const Schema = require('mongoose')
const slugify = require('slugify')

const jobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    default: function () { // enables access to 'this'
      return slugify(this.name)
    }
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
