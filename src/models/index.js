const glob = require('glob')
const path = require('path')
const mongoose = require('mongoose')

// load each file in the models directory
let models = []
glob.sync('./src/models/!(index).js').forEach(file => {
  // only load models that havent been loaded yet
  const filename = path.basename(file, path.extname(file))
  const modelName = filename.charAt(0).toUpperCase() + filename.slice(1)
  let model = null
  try {
    model = mongoose.model(modelName)
  } catch (error) {
    // @TODO - throw? not necessary cos im expecting `try` to fail if model doesn't exist
  }
  if (!model) {
    model = require(path.resolve(file))
  }
  models.push(model)
})

module.exports = models
