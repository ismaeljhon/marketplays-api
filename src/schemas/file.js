const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  contentType: {
    type: String
  },
  path: {
    type: String
  },
  file: {
    type: String
  }
})

module.exports = fileSchema
