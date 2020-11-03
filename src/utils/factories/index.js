const glob = require('glob')
const path = require('path')

let factories = {}
glob.sync(`./src/utils/factories/!(index).js`).forEach(file => {
  let factory = require(path.resolve(file))
  factories = {
    ...factories,
    ...factory
  }
})

module.exports = factories
