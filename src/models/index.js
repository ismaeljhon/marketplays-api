const glob = require('glob')
const path = require('path')

let models = []

// load each file in the models directory
glob.sync('./src/models/!(index).js').forEach(file => {
  models.push(require(path.resolve(file)))
})

module.exports = models
