const attributeSchema = require('../schemas/attribute')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Attribute model using discriminators
const Attribute = generateModel('Attribute', attributeSchema, {
  baseModel: getModel('Property') // configure discriminator
})
module.exports = Attribute
