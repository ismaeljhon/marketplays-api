const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const context = require('./utils/context')
const schema = require('./modules')

const server = new ApolloServer({
  schema: schema,
  context: async ({ req }) => ({
    user: await context.getUser(req)
  }),
  introspection: false,
  playground: false
})

const app = express()

server.applyMiddleware({
  path: '/',
  app
})

module.exports = app
