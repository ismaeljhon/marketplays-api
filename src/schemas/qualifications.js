const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const qualificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  users: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  }
})

// plugins
qualificationsSchema.plugin(uniqueValidator)

module.exports = qualificationsSchema
