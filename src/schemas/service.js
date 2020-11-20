const mongoose = require('mongoose')
const Schema = require('mongoose')
const slugify = require('slugify')

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  shortDescription: {
    type: String
  },
  pricing: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    default: function () { // enables access to 'this'
      return slugify(this.name)
    }
  },
  workforceThreshold: {
    type: Number
  },
  tags: {
    type: [String]
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
  projectManager: {
    type: Schema.Types.ObjectId,
    default: null
  },
  currency: {
    type: String
  },
  image: {
    type: String
  },
  department: {
    type: Schema.Types.ObjectId,
    default: null
  },
  attributes: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = serviceSchema
