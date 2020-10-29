const jobSchema = require('../schemas/job')
const generateModel = require('../utils/generate-model')
const Job = generateModel('Job', jobSchema)

module.exports = Job
