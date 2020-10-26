const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autopopulate = require('mongoose-autopopulate')

const User = require('./user')

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

// apply pre, post hooks
departmentSchema.post('save', async (department, next) => {
  // add department to user teamLead of
  // @TODO - add check if adding a department to a user fails
  await User.updateOne(
    { _id: department.teamLead },
    { $push: { teamLeadOf: department._id } }
  )
  next()
})

departmentSchema.plugin(uniqueValidator)
departmentSchema.plugin(autopopulate)

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department
