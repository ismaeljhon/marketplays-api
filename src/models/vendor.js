const vendorSchema = require('../schemas/vendor')
const generateModel = require('../utils/generate-model')
const User = require('./user')

const Vendor = generateModel('Vendor', vendorSchema, User)

module.exports = Vendor
