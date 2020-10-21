const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autopopulate = require('mongoose-autopopulate')

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
  },
  teamLead: {
    type: String
  }
})

departmentSchema.plugin(uniqueValidator)
departmentSchema.plugin(autopopulate)

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department
