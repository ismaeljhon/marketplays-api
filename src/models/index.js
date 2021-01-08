const glob = require('glob')
const path = require('path')
const getModel = require('../utils/get-model')

// load each file in the models directory
let models = []
glob.sync('./src/models/!(index).js').forEach(file => {
  // only load models that havent been loaded yet
  const filename = path.basename(file, path.extname(file))
  const modelName = filename.charAt(0).toUpperCase() + filename.slice(1)
  models.push(getModel(modelName))
})

module.exports = models
