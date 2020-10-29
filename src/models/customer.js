const customerSchema = require('../schemas/customer')
const generateModel = require('../utils/generate-model')
const Customer = generateModel('Customer', customerSchema)

module.exports = Customer
