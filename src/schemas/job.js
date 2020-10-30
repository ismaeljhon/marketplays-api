const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  instructions: {
    type: String
  },
  biddable: {
    type: Boolean
  },
  openingMarketBid: {
    type: Number
  },
  type: {
    type: String // @TODO either 'hourly' or 'project'
  },
  timeframe: {
    type: Number // in minutes
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
  currency: {
    type: String
  },
  requiredCertificates: {
    type: [String] // @TODO - array of certificates
  },
  category: {
    type: String // @TODO -reference to job categories
  }
})

module.exports = jobSchema
