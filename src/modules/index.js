const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const models = require('../models')
const glob = require('glob')
const path = require('path')
const pluralize = require('pluralize')

// auto-compose default schemas for each models
const addToSchema = (model) => {
  const modelName = model.modelName
  const typeComposer = composeWithMongoose(model)

  let queries = {}
  queries[`${modelName}Many`] = typeComposer.getResolver('findMany')
  queries[`${modelName}ById`] = typeComposer.getResolver('findById')
  queries[`${modelName}One`] = typeComposer.getResolver('findOne')
  queries[`${modelName}Count`] = typeComposer.getResolver('count')
  schemaComposer.Query.addFields(queries)

  let mutations = {}
  mutations[`${modelName}CreateOne`] = typeComposer.getResolver('createOne')
  mutations[`${modelName}UpdateById`] = typeComposer.getResolver('updateById')
  mutations[`${modelName}RemoveById`] = typeComposer.getResolver('removeById')
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
