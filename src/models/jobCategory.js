const jobCategorySchema = require('../schemas/jobCategory')
const generateModel = require('../utils/generate-model')
const JobCategory = generateModel('JobCategory', jobCategorySchema)

module.exports = JobCategory
