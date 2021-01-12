const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const models = require('../models')
const glob = require('glob')
const path = require('path')
const pluralize = require('pluralize')
const { remove } = require('lodash')

// auto-compose default schemas for each models
const addToSchema = (model) => {
  const modelName = model.modelName
  const lowerCaseModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1)
  const typeComposer = composeWithMongoose(model)

  let queries = {}
  queries[pluralize(lowerCaseModelName)] = typeComposer.getResolver('findMany')
  queries[lowerCaseModelName] = typeComposer.getResolver('findById')
  queries[`getOne${modelName}`] = typeComposer.getResolver('findOne')
  queries[`count${pluralize(modelName)}`] = typeComposer.getResolver('count')
  schemaComposer.Query.addFields(queries)

  let mutations = {}
  mutations[`createOne${modelName}`] = typeComposer.getResolver('createOne')
  mutations[`update${modelName}ById`] = typeComposer.getResolver('updateById')
  mutations[`remove${modelName}ById`] = typeComposer.getResolver('removeById')
  schemaComposer.Mutation.addFields(mutations)
}

models.forEach(model => {
  addToSchema(model, {})
})

// check for any custom relationships, types and resolvers
let customDefinitions = [ 'types', 'relations', 'resolvers' ]
// add `globals` on top of the directories to load definitions
// that can be used across other definitions
let directories = models.map(model => {
  const directory = pluralize(model.modelName)
  return directory.charAt(0).toLowerCase() + directory.slice(1)
})
directories.unshift('globals')

// loop through each directories and load definitions
directories.forEach(directory => {
  customDefinitions.forEach(definition => {
    let files = glob.sync(`./src/modules/${directory}/${definition}/*.js`)
    if (files.length > 0) {
      // sort so that index will be loaded first
      const indexFile = remove(files, (file) => {
        return file.endsWith('index.js')
      }).pop()
      if (typeof indexFile !== 'undefined') {
        files.unshift(indexFile)
      }
      files.forEach(file => {
        models.push(require(path.resolve(file)))
      })
    }
  })
})

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
