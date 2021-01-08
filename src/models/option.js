const optionSchema = require('../schemas/option')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')
const Property = getModel('Property')

// configure discriminator
Property.discriminator('Option', optionSchema)

const Option = generateModel('Option', optionSchema)
module.exports = Option
