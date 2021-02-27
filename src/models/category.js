const categorySchema = require('../schemas/category')
const generateModel = require('../utils/generate-model')
const Category = generateModel('Category', categorySchema)

module.exports = Category
