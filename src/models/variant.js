const variantSchema = require('../schemas/variant')
const generateModel = require('../utils/generate-model')
const Variant = generateModel('Variant', variantSchema)

module.exports = Variant
