const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autopopulate = require('mongoose-autopopulate')
const generateModel = require('../utils/generate-model')

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
    type: Schema.Types.ObjectId
  }
})

departmentSchema.plugin(uniqueValidator)
departmentSchema.plugin(autopopulate)

const Department = generateModel('Department', departmentSchema)

module.exports = Department
