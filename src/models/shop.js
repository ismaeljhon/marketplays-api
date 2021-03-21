const shopSchema = require('../schemas/shop')
const generateModel = require('../utils/generate-model')
const Shop = generateModel('Shop', shopSchema)

module.exports = Shop
