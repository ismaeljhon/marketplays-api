const glob = require('glob')
const path = require('path')
const getModel = require('../utils/get-model')

// load each file in the models directory
let models = []
glob.sync('./src/models/!(index).js').forEach(file => {
  // only load models that havent been loaded yet
  const modelName = file.charAt(0).toUpperCase() + file.slice(1)
  if (!getModel(modelName, false)) {
    models.push(require(path.resolve(file)))
  }
})

module.exports = models
