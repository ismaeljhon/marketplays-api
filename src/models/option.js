const mongoose = require('mongoose')
const optionSchema = require('../schemas/option')
const generateModel = require('../utils/generate-model')
const Property = mongoose.models['Property']

// configure discriminator
Property.discriminator('Option', optionSchema)

const Option = generateModel('Option', optionSchema)
module.exports = Option
