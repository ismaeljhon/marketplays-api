const orderlineSchema = require('../schemas/orderline')
const generateModel = require('../utils/generate-model')
const Orderline = generateModel('Orderline', orderlineSchema)

module.exports = Orderline
