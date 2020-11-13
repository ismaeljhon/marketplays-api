const serviceRequestSchema = require('../schemas/serviceRequest')
const generateModel = require('../utils/generate-model')

const ServiceRequest = generateModel('ServiceRequest', serviceRequestSchema)

module.exports = ServiceRequest
