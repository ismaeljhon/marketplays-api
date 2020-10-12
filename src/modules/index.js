const { makeExecutableSchemaFromModules } = require('../utils/modules')

const auth = require('./auth')
const books = require('./books')
const departments = require('./departments')

module.exports = makeExecutableSchemaFromModules({
  modules: [
    auth,
    books,
    departments
  ]
})
