const mongoose = require('mongoose')
const {
  map,
  uniq,
  flatten,
  keyBy
} = require('lodash')
const itemAttributeSchema = require('../schemas/itemAttribute')
const generateModel = require('../utils/generate-model')

itemAttributeSchema.statics.createManyFromAttributeData = async (attributeInputData) => {
  const Attribute = mongoose.models['Attribute']
  const Option = mongoose.models['Option']
  const ItemAttribute = mongoose.models['ItemAttribute']

  // create the attributes
  const attributeNames = uniq(map(attributeInputData, 'name'))
  const attributes = await Attribute.findOrCreate(attributeNames)

  // generate the options
  const optionNames = uniq(flatten(map(attributeInputData, 'options')))
  const options = await Option.findOrCreate(optionNames)

  // build item attribute data (along with the corresponding options)
  // honoring how it was sorted in the input data
  const keyedAttributes = keyBy(attributes, 'name')
  const keyedOptions = keyBy(options, 'name')
  const itemAttributeData = attributeInputData.map(attribute => {
    let data = {}
    data.attribute = keyedAttributes[attribute.name]._id
    data.options = attribute.options.map(option => {
      return keyedOptions[option]._id
    })
    return data
  })
  const itemAttributes = await ItemAttribute.insertMany(itemAttributeData)
  return map(itemAttributes, '_id')
}

const ItemAttribute = generateModel('ItemAttribute', itemAttributeSchema)

module.exports = ItemAttribute
