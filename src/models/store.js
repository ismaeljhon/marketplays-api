const storeSchema = require('../schemas/store')
const generateModel = require('../utils/generate-model')
const Store = generateModel('Store', storeSchema)

module.exports = Store
