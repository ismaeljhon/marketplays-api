const mongoose = require('mongoose')
const {
  map,
  uniq,
  flatten,
  keyBy
} = require('lodash')
const { UserInputError } = require('apollo-server-express')
const itemAttributeSchema = require('../schemas/itemAttribute')
const generateModel = require('../utils/generate-model')

itemAttributeSchema.statics.createManyFromAttributeData = async (attributeInputData) => {
  const Attribute = mongoose.models['Attribute']
  const Option = mongoose.models['Option']
  const ItemAttribute = mongoose.models['ItemAttribute']

  // create the attributes
  const attributeNames = uniq(map(attributeInputData, 'name'))
  // make sure attribute names are unique
  if (attributeNames.length < attributeInputData.length) {
    throw new UserInputError(`Duplicate attribute names exist.`)
  }
  const attributes = await Attribute.findOrCreate(attributeNames)

  // make sure options names are unique per attribute
  let optionNames = map(attributeInputData, 'options')
  optionNames.forEach((names, index) => {
    if (uniq(names).length < names.length) {
      throw new UserInputError(`Duplicate options exist on attribute ${attributeInputData[index].name}`)
    }
  })

  // generate the options
  optionNames = uniq(flatten(optionNames))
  const options = await Option.findOrCreate(optionNames)

  // build item attribute data (along with the corresponding options)
  // honoring how it was sorted in the input data
  const keyedAttributes = keyBy(attributes, 'name')
  const keyedOptions = keyBy(options, 'name')

  // @TODO - itemAttribute should be unique
  // eg an item cannot have 2 attributes named 'Size'
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
