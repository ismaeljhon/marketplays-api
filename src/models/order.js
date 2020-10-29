const orderSchema = require('../schemas/order')
const generateModel = require('../utils/generate-model')
const Order = generateModel('Order', orderSchema)

module.exports = Order
