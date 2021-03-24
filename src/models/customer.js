const customerSchema = require('../schemas/customer')
const generateModel = require('../utils/generate-model')
const User = require('../models/user')

const Customer = generateModel('Customer', customerSchema, User)

module.exports = Customer
