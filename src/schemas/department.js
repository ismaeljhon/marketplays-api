const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const slugify = require('slugify')

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
  teamLead: {
    type: Schema.Types.ObjectId,
    default: null
  },
  services: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

departmentSchema.plugin(uniqueValidator)

module.exports = departmentSchema
