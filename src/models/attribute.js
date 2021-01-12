const attributeSchema = require('../schemas/attribute')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Attribute model using discriminators
const Attribute = generateModel('Attribute', attributeSchema, {
  // @TODO - update generateModel method to instead receive a base model name
  // instead of the actual model
  baseModel: getModel('Property') // configure discriminator
})

// configuration for discriminator class
Attribute.__discriminatorConfig = {
  discriminatorModel: true,
  typeConverterOptions: {},
  baseModelName: 'Property'
}
module.exports = Attribute
