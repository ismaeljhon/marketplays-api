const mongoose = require('mongoose')
const Schema = require('mongoose')
const options = {
  // add discriminators for distinguish properties of certain type
  // in this case, product or service
  discriminatorKey: 'kind'
}

const serviceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  workforceThreshold: {
    type: Number
  },
  projectManager: {
    type: Schema.Types.ObjectId,
    default: null
  },
  currency: {
    type: String
  },
  department: {
    type: Schema.Types.ObjectId,
    default: null
  }
}, options)

module.exports = serviceSchema
