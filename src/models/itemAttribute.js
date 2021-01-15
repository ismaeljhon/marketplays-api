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

/**
 * Checks if an attribute data is valid
 * @param {Object[]} attributeInputData Array of attribute data to validate
 *
 * @return {(Boolean|Error)} returns true if attribute data is valid, throws an error if invalid
 *
 * @example
 *
 * const ItemAttribute = require('./models/itemAttribute')
 *
 * // returns true
 * ItemAttribute.validateAttributeData([
 *  {
 *    attribute: {  code: 'size', name: "Size" }
 *    options: [
 *        { code: "S", name: "Small" },
 *        { code: "M", name: "Medium" }
 *    ]
 *  },
 *  {
 *    attribute: {  code: 'color', name: "Color" }
 *    options: [
 *        { code: "RED", name: "Red" },
 *        { code: "BLU", name: "Green" }
 *    ]
 *  }
 * ])
 *
 * // throws an error due to duplicate codes
 * ItemAttribute.validateAttributeData([
 *  {
 *    attribute: {  code: 'size', name: "Size" }
 *    options: [
 *        { code: "S", name: "Small" },
 *        { code: "S", name: "Medium" }
 *    ]
 *  },
 *  {
 *    attribute: {  code: 'color', name: "Color" }
 *    options: [
 *        { code: "RED", name: "Red" },
 *        { code: "RED", name: "Green" }
 *    ]
 *  }
 * ])
 */
itemAttributeSchema.statics.validateAttributeData = function (attributeInputData) {
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

/**
 * Creates item attributes out of the provided list of attribute data
 * @param {Object[]} attributeInputData Array of attribute data to create item attributes with
 *
 * @return {(string[]|Error)} returns an array of objects IDs of the created item attributes, throws an error if data is invalid
 *
* @example
 *
 * const ItemAttribute = require('./models/itemAttribute')
 *
 * const itemAttributes = await ItemAttribute.createManyFromAttributeData([
 *  {
 *    attribute: {  code: 'size', name: "Size" }
 *    options: [
 *        { code: "S", name: "Small" },
 *        { code: "M", name: "Medium" }
 *    ]
 *  },
 *  {
 *    attribute: {  code: 'color', name: "Color" }
 *    options: [
 *        { code: "RED", name: "Red" },
 *        { code: "BLU", name: "Green" }
 *    ]
 *  }
 * ])
 */
itemAttributeSchema.statics.createManyFromAttributeData = async function (attributeInputData) {
  let isValid = false
  try {
    isValid = this.validateAttributeData(attributeInputData)
  } catch (error) {
    throw error
  }
  // make sure attribute data is valid
  if (isValid) {
    // find or create attributes, options
    const Attribute = mongoose.models['Attribute']
    const Option = mongoose.models['Option']
    const ItemAttribute = mongoose.models['ItemAttribute']
    const attributeInput = map(attributeInputData, 'attribute')
    const optionInput = flatten(map(attributeInputData, 'options'))
    const optionMap = keyBy(optionInput, 'code')
    return Attribute.findOrCreate(attributeInput)
      .then(attributes => {
        return attributes
      })
      .then(attributes => {
        return Option.findOrCreate(Object.values(optionMap))
          .then(options => {
            return {
              attributes: keyBy(attributes, 'code'),
              options: keyBy(options, 'code')
            }
          })
      })
      .then(({ attributes, options }) => {
        // prepare itemattribute data by by mapping codes to ids
        const itemAttributeData = attributeInputData.map(itemAttributeInput => {
          return {
            attribute: attributes[itemAttributeInput.attribute.code]._id,
            options: itemAttributeInput.options.map(optionInput => {
              return options[optionInput.code]._id
            })
          }
        })
        return ItemAttribute.insertMany(itemAttributeData)
      })
      .then(result => {
        return map(result, '_id')
      })
      .catch(error => {
        throw error
      })
  }
}

itemAttributeSchema.statics.cleanup = async function () {
  return this.deleteMany({
    item: null
  })
}

const ItemAttribute = generateModel('ItemAttribute', itemAttributeSchema)
module.exports = ItemAttribute
