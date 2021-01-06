const mongoose = require('mongoose')
const {
  map,
  keyBy,
  flatten
} = require('lodash')
const hasDuplicates = require('../utils/has-duplicates')
const { UserInputError } = require('apollo-server-express')
const itemAttributeSchema = require('../schemas/itemAttribute')
const generateModel = require('../utils/generate-model')

itemAttributeSchema.statics.validateAttributeData = async function (attributeInputData) {
  // get all attributes, options, retaining the sort
  let attributeInput = map(attributeInputData, 'attribute')
  let optionInput = map(attributeInputData, 'options')

  // make sure attribute codes are unique
  if (hasDuplicates(map(attributeInput, 'code'))) {
    throw new UserInputError(`Duplicate attribute codes exist.`)
  }

  // make sure options codes are unique per attribute
  let optionMap = {}
  optionInput.forEach((list, index) => {
    let codes = map(list, 'code')
    if (hasDuplicates(codes)) {
      throw new UserInputError(`Duplicate option codes exist on attribute code ${attributeInput[index].code}`)
    }

    // make sure option names are unique per option code
    // for the entire attributeData
    // eg if there is a option of : {code: 'SML', name: 'Small'},
    // there cannot be another option of: {code: 'SML', name: '2x2 cm'}
    list.forEach(optionData => {
      if (optionMap[optionData.code] && optionMap[optionData.code].name !== optionData.name) {
        // @TODO - check if the option code that is already saved, but being used here with a different name
        throw new UserInputError(`Option code ${optionData.code} already exists with a name ${optionMap[optionData.code].name}.`) // @TODO - update message
      }
      optionMap[optionData.code] = optionData
    })
  })
  return true
}
itemAttributeSchema.statics.createManyFromAttributeData = async function (attributeInputData) {
  // make sure attribute data is valid
  if (!this.validateAttributeData(attributeInputData)) {
    throw new UserInputError('Invalid attribute data provided.')
  }

  // find or create attributes, options
  const Attribute = mongoose.models['Attribute']
  const Option = mongoose.models['Option']
  const ItemAttribute = mongoose.models['ItemAttribute']
  const attributeInput = map(attributeInputData, 'attribute')
  const optionInput = flatten(map(attributeInputData, 'options'))
  let optionMap = {}
  optionInput.forEach(option => {
    optionMap[option.code] = option
  })
  let attributes = await Attribute.findOrCreate(attributeInput)
  let options = await Option.findOrCreate(Object.values(optionMap))
  attributes = keyBy(attributes, 'code')
  options = keyBy(options, 'code')

  // prepare itemattribute data by by mapping codes to ids
  const itemAttributeData = attributeInputData.map(itemAttributeInput => {
    return {
      attribute: attributes[itemAttributeInput.attribute.code]._id,
      options: itemAttributeInput.options.map(optionInput => {
        return options[optionInput.code]._id
      })
    }
  })

  // create itemAttributes
  const itemAttributes = await ItemAttribute.insertMany(itemAttributeData)
  return map(itemAttributes, '_id')
}

const ItemAttribute = generateModel('ItemAttribute', itemAttributeSchema)

module.exports = ItemAttribute
