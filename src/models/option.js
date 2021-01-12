const optionSchema = require('../schemas/option')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Option model using discriminators
const Option = generateModel('Option', optionSchema, {
  // @TODO - update generateModel method to instead receive a base model name
  // instead of the actual model
  baseModel: getModel('Property') // configure discriminator
})

// configuration for discriminator class
Option.__discriminatorConfig = {
  discriminatorModel: true,
  typeConverterOptions: {},
  baseModelName: 'Property'
}
module.exports = Option
