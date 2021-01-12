const productSchema = require('../schemas/product')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Service model using discriminators
const Product = generateModel('Product', productSchema, {
  baseModel: getModel('Item') // configure discriminator
})

// configuration for discriminator class
Product.__discriminatorConfig = {
  discriminatorModel: true,
  typeConverterOptions: {},
  baseModelName: 'Item'
}

module.exports = Product
