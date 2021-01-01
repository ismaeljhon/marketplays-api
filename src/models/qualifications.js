const qualificationsSchema = require('../schemas/qualifications')
const generateModel = require('../utils/generate-model')
const Qualification = generateModel('Qualification', qualificationsSchema)

module.exports = Qualification
