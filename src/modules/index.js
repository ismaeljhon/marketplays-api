const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const models = require('../models')
const glob = require('glob')
const path = require('path')
const pluralize = require('pluralize')

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
models.forEach(model => {
  let directory = pluralize(model.collection.collectionName)
  customDefinitions.forEach(definition => {
    glob.sync(`./src/modules/${directory}/${definition}/!(index).js`).forEach(file => {
      models.push(require(path.resolve(file)))
    })
  })
})

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
