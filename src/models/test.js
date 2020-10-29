const testSchema = require('../schemas/test')
const generateModel = require('../utils/generate-model')

const Test = generateModel('Test', testSchema)

module.exports = Test
