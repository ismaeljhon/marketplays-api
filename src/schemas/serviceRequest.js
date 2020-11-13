const mongoose = require('mongoose')
const Schema = require('mongoose')

const serviceRequestSchema = new mongoose.Schema({
  subscription: { // @TODO - required?
    type: Schema.Types.ObjectId,
    default: null
  },
  service: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String, // @TODO - enum?
    default: 'pending'
  },
  jobs: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

module.exports = serviceRequestSchema
