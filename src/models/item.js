/**
 * Item abstract model
 * This is where all property instances (eg Product, Service) will inherit from
 * item static methods, functions are defined by this abstract model
 */
const mongoose = require('mongoose')
const itemSchema = require('../schemas/item')
const generateModel = require('../utils/generate-model')
const Item = generateModel('Item', itemSchema)

itemSchema.statics.prepareArgs = async function (args) {
  const ItemAttribute = mongoose.model('ItemAttribute')
  const Variant = mongoose.model('Variant')
  // since the schema for creating an item requies that the attributes and variants fields
  // are of ObjectID, the values will become null at `create` method level.
  // case in point, we need to create them first out of the input data
  // then update the payload to reflect the IDs
  if (Array.isArray(args.record.attributes) && args.record.attributes.length > 0 &&
      Array.isArray(args.record.variants) && args.record.variants.length > 0) {
    return ItemAttribute.createManyFromAttributeData(args.record.attributes)
      .then(result => {
        args.record.attributes = result
        return Variant.validateAndCreateMany(args.record.variants, args.record.attributes)
          .then(result => {
            args.record.variants = result
            return args
          })
          .catch((error) => {
            throw error
          })
      })
      .catch(error => {
        throw error
      })
  }
  return args
}

module.exports = Item
