const productSchema = require('../schemas/product')
const generateModel = require('../utils/generate-model')
const Product = generateModel('Product', productSchema)

module.exports = Product
