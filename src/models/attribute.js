const mongoose = require('mongoose')
const attributeSchema = require('../schemas/attribute')
const generateModel = require('../utils/generate-model')
const Property = mongoose.models['Property']

// configure discriminator
Property.discriminator('Attribute', attributeSchema)

const Attribute = generateModel('Attribute', attributeSchema)
module.exports = Attribute
