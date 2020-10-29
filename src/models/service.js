const serviceSchema = require('../schemas/service')
const generateModel = require('../utils/generate-model')
const Service = generateModel('Service', serviceSchema)

module.exports = Service
