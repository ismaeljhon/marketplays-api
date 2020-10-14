const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  pricing: {
    type: Number,
    required: true
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

departmentSchema.plugin(uniqueValidator)

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department
