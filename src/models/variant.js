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
  // make sure there are no duplicate attributes
  if (uniq(map(attributeData, 'attribute')).length < attributeData.length) {
    throw new UserInputError(`Duplicate attribute names exist.`)
  }

  // get all the options
  let options = map(attributeData, 'options')

  // make sure options are unique per attribute data
  options.forEach((optionList, index) => {
    if (uniq(optionList).length < optionList.length) {
      throw new UserInputError(`Duplicate options exist on attriute ${attributeData[index].attribute}`)
    }
  })

  // generate all the combinations
  let combinations = fastCartesian(options)

  // build variant data
  let variants = []
  combinations.forEach(combination => {
    variants.push({
      name: combination.join(', '),
      attributeData: combination.map((option, index) => {
        // since this honors how attribute data has been sorted,
        // we'll map the combination index to its corresponding attribute (parent)
        return {
          attribute: { name: attributeData[index].attribute },
          option: { name: option }
        }
      })
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
