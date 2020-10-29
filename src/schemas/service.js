const mongoose = require('mongoose')
const Schema = require('mongoose')

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
    type: String
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
    type: String
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
  }
})

module.exports = serviceSchema
