const mongoose = require('mongoose')
const Schema = require('mongoose')
const slugify = require('slugify')

// discriminator key
const dKey = 'kind'

// item kinds
const enumItemKind = {
  PRODUCT: 'Product',
  SERVICE: 'Service'
}
const itemSchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
    enum: Object.keys(enumItemKind)
  },
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
    required: true,
    default: 0.00
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
})

// set discriminator Key
itemSchema.set('discriminatorKey', dKey)

module.exports = itemSchema
