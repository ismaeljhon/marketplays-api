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
  if (Object.keys(attributes) < attributeData.length) {
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

variantSchema.statics.validateAndCreateMany = async (variantData, itemAttributeIds) => {
  const ItemAttribute = mongoose.models['ItemAttribute']
  const Variant = mongoose.models['Variant']
  const itemAttributes = keyBy(await ItemAttribute.find({
    _id: { $in: itemAttributeIds }
  }).populate(['attribute', 'options']), 'attribute.name')
  let validated = []
  variantData.forEach(variant => {
    let validatedAttributeData = []
    variant.attributeData.forEach(data => {
      const itemAttribute = itemAttributes[data.attribute]

      // check if the attribute is valid
      if (!itemAttribute) {
        throw new UserInputError(`Variant attribute '${data.attribute}' not found in the provided attributes.`)
      }

      // check if the option is valid
      const keyedOptions = keyBy(itemAttribute.options, 'name')
      if (indexOf(Object.keys(keyedOptions), data.option) < 0) {
        throw new UserInputError(`Variant attribute option '${data.option}' not found in the provided attribute options.`)
      }

      // convert names to ids
      validatedAttributeData.push({
        attribute: itemAttribute.attribute._id,
        option: keyedOptions[data.option]._id
      })
    })

    // make sure no variants of duplicate attributeData will be created
    if (find(validated, (variant) => {
      return isEqual(variant.attributeData, validatedAttributeData)
    })) {
      throw new UserInputError(`Variants of duplicate attribute data exists.`)
    }
    validated.push({
      ...variant,
      attributeData: validatedAttributeData
    })
  })

  // create the variants
  const variants = await Variant.insertMany(validated)
  return map(variants, '_id')
}

const Variant = generateModel('Variant', variantSchema)

module.exports = Variant
