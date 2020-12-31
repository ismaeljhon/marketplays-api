const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const context = require('./utils/context')
const schema = require('./modules')

const server = new ApolloServer({
  schema: schema,
  context: async ({ req }) => ({
    user: await context.getUser(req)
  })
})

const app = express()

server.applyMiddleware({
  path: '/',
  app
})

// app.use("/api", validator, routes);

module.exports = app
