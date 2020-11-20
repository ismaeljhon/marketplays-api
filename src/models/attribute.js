const mongoose = require('mongoose')
const {
  map,
  difference
} = require('lodash')
const attributeSchema = require('../schemas/attribute')
const generateModel = require('../utils/generate-model')

attributeSchema.statics.findOrCreate = async (attributeNames) => {
  const Attribute = mongoose.models['Attribute']
  const existingAttributes = await Attribute.find({
    name: { $in: attributeNames }
  })

  // create the attributes that does not exist yet
  const toCreate = difference(attributeNames, map(existingAttributes, 'name'))
  const newAttributeData = toCreate.map(name => {
    return {
      name: name
    }
  })
  const newAttributes = await Attribute.insertMany(newAttributeData)
  return [
    ...existingAttributes,
    ...newAttributes
  ]
}

const Attribute = generateModel('Attribute', attributeSchema)

module.exports = Attribute
