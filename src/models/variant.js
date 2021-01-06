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
  isEqual,
  uniq
} = require('lodash')

variantSchema.statics.generateMany = async (attributeData) => {
  let attributes = keyBy(map(attributeData, 'attribute'), 'code')
  // make sure no duplicate attribute exists
  if (Object.keys(attributes).length < attributeData.length) {
    throw new UserInputError(`Attribute codes must be unique.`)
  }

  // make sure no duplicate option per attribute exists
  let rawOptions = map(attributeData, 'options')
  let options = {}
  rawOptions.forEach((list, index) => {
    if (uniq(map(list, 'code')).length < list.length) {
      throw new UserInputError(`Duplicate options exist on attribute code: ${attributeData[index].attribute.code}`)
    }

    // map the option names to its respective code
    // note that since a code is only unique per attribute,
    // it's name should be the same if it will be used under a different attribute
    list.forEach(option => {
      if (options[option.code] && options[option.code].name !== option.name) {
        throw new UserInputError(`Option code ${option.code} already exists with a name ${options[option.code].name}.`) // @TODO - update message
      }
      options[option.code] = option
    })
  })

  // retrieve option codes per attribute
  let optionCodes = rawOptions.map(option => {
    return map(option, 'code')
  })
  let combinations = fastCartesian(optionCodes)

  // build variant data
  let variants = []
  combinations.forEach((combination) => {
    let names = []
    let lineAttributeData = []
    combination.forEach((optionCode, index) => {
      names.push(options[optionCode].name)
      lineAttributeData.push({
        // since this honors how attribute data has been sorted,
        // we'll map the combination index to its corresponding attribute (parent)
        attribute: attributeData[index].attribute,
        option: options[optionCode]
      })
    })
    variants.push({
      name: names.join(', '),
      code: combination.join('-'),
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
