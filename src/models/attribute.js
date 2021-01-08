const attributeSchema = require('../schemas/attribute')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')
const Property = getModel('Property')

// configure discriminator
Property.discriminator('Attribute', attributeSchema)

const Attribute = generateModel('Attribute', attributeSchema)
module.exports = Attribute
