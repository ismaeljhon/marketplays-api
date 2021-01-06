const mongoose = require('mongoose')
const variantSchema = require('../schemas/variant')
const generateModel = require('../utils/generate-model')
const fastCartesian = require('fast-cartesian')
const { UserInputError } = require('apollo-server-express')
const {
  map,
  keyBy,
  indexOf,
  find,
  isEqual
} = require('lodash')
/**
 * Generates an array of variant data out of the provided attribute data
 * @param {Array} attributeData array of structured attribute data to generate variants with
 *                              eg:
 *                              [
 *                                {
 *                                  attribute: {  code: 'size', name: "Size" }
 *                                  options: [
 *                                      { code: "S", name: "Small" },
 *                                      { code: "M", name: "Medium" }
 *                                  ]
 *                                },
 *                                {
 *                                  attribute: {  code: 'color', name: "Color" }
 *                                  options: [
 *                                      { code: "RED", name: "Red" },
 *                                      { code: "BLU", name: "Green" }
 *                                  ]
 *                                }
 *                              ]
 * @return {Array} list of variant data
 */
variantSchema.statics.generateFromAttributes = async (attributeInputData) => {
  // make sure attribute data is valid
  let itemAttribute = mongoose.model('ItemAttribute')
  const isValid = await itemAttribute.validateAttributeData(attributeInputData)
  if (!isValid) {
    throw new UserInputError('Invalid attribute data provided.')
  }

  // get all attributes, options, retaining the sort
  let attributeInput = map(attributeInputData, 'attribute')
  const optionInput = map(attributeInputData, 'options')

  // prepare option data
  let optionMap = {}
  let optionCodes = []
  optionInput.forEach(options => {
    let lineCodes = []
    options.forEach(option => {
      lineCodes.push(option.code)
      if (!optionMap[option.code]) {
        optionMap[option.code] = option
      }
    })
    optionCodes.push(lineCodes)
  })

  // generate combinations
  let combinations = fastCartesian(optionCodes)

  // build variant data
  let variants = []
  combinations.forEach((combination) => {
    let names = []
    let lineAttributeData = []
    combination.forEach((optionCode, index) => {
      names.push(optionMap[optionCode].name)
      lineAttributeData.push({
        // since this honors how attribute data has been sorted,
        // we'll map the combination index to its corresponding attribute (parent)
        attribute: attributeInput[index],
        option: optionMap[optionCode]
      })
    })
    variants.push({
      name: names.join(', '),
      code: combination.join('-'), // @TODO - should prefix the item code. should we add item code to generateVariants payload?
      attributeData: lineAttributeData
    })
  })
  return variants
}

variantSchema.statics.validateAndCreateMany = async function (variantInputData, itemAttributeIds) {
  // retrieve related item attributes
  const ItemAttribute = mongoose.models['ItemAttribute']
  let itemAttributes = await ItemAttribute.find({
    _id: { $in: itemAttributeIds }
  }).populate(['attribute', 'options'])
  itemAttributes = keyBy(itemAttributes, 'attribute.code')

  // prepare and validate variant input data
  let validated = []
  variantInputData.forEach(variantInput => {
    let validatedAttributeData = []
    variantInput.attributeData.forEach(attributeInputData => {
      const itemAttribute = itemAttributes[attributeInputData.attribute]

      // make sure attributes set for the variant are valid
      if (!itemAttribute) {
        throw new UserInputError(`Variant attribute '${attributeInputData.attribute}' not found in the provided attributes.`)
      }

      // check if the option is valid
      const keyedOptions = keyBy(itemAttribute.options, 'code')
      if (indexOf(Object.keys(keyedOptions), attributeInputData.option) < 0) {
        throw new UserInputError(`Variant attribute option '${attributeInputData.option}' not found in the provided attribute options.`)
      }

      // convert names to ids
      validatedAttributeData.push({
        attribute: itemAttribute.attribute._id,
        option: keyedOptions[attributeInputData.option]._id
      })
    })

    // make sure no variants of duplicate attributeData will be created
    if (find(validated, (variant) => {
      return isEqual(variant.attributeData, validatedAttributeData)
    })) {
      throw new UserInputError(`Variants of duplicate attribute data exists.`)
    }
    validated.push({
      ...variantInput,
      attributeData: validatedAttributeData
    })
  })

  // create the variants
  const variants = await this.insertMany(validated)
  return map(variants, '_id')
}

const Variant = generateModel('Variant', variantSchema)

module.exports = Variant
