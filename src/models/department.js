const departmentSchema = require('../schemas/department')
const generateModel = require('../utils/generate-model')
const Department = generateModel('Department', departmentSchema)

module.exports = Department
