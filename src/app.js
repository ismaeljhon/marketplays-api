const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const context = require('./utils/context')
const schema = require('./modules')

const server = new ApolloServer({
  schema: schema,
  context: async ({ req }) => ({
    user: await context.getUser(req)
  }),
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
})

const app = express()

server.applyMiddleware({
  path: '/',
  app
})

module.exports = app
