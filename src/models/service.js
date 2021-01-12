const serviceSchema = require('../schemas/service')
const generateModel = require('../utils/generate-model')
const getModel = require('../utils/get-model')

// construct Service model using discriminators
const Service = generateModel('Service', serviceSchema, {
  baseModel: getModel('Item') // configure discriminator
})

// configuration for discriminator class
Service.__discriminatorConfig = {
  discriminatorModel: true,
  typeConverterOptions: {},
  baseModelName: 'Item'
}

module.exports = Service
