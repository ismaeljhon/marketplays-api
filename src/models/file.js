const fileSchema = require('../schemas/file')
const generateModel = require('../utils/generate-model')
const File = generateModel('File', fileSchema)

module.exports = File
