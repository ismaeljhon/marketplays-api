const variantSchema = require('../schemas/variant')
const generateModel = require('../utils/generate-model')
const fastCartesian = require('fast-cartesian')
const {
  map
} = require('lodash')

variantSchema.statics.generateMany = async ({ attributeData }) => {
  // get all the options
  let options = map(attributeData, 'options')

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

const Variant = generateModel('Variant', variantSchema)

module.exports = Variant
