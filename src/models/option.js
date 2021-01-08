const optionSchema = require('../schemas/option')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Option model using discriminators
const Option = generateModel('Option', optionSchema, {
  baseModel: getModel('Property') // configure discriminator
})
module.exports = Option
