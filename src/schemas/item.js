const mongoose = require('mongoose')
const Schema = require('mongoose')
const slugify = require('slugify')
const options = {
  // add discriminators for distinguish properties of certain type
  // in this case, product or service
  discriminatorKey: 'kind'
}

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  shortDescription: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    default: function () { // enables access to 'this'
      return slugify(this.name)
    }
  },
  tags: {
    type: [String]
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
  attributes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  variants: {
    type: [Schema.Types.ObjectId],
    default: []
  }
}, options)

module.exports = itemSchema
