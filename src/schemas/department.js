const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = require('./user')

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
    type: String
  },
  slug: {
    type: String
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
    type: userSchema,
    default: null
  }
})

departmentSchema.plugin(uniqueValidator)

module.exports = departmentSchema
