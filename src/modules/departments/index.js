const { gql } = require('apollo-server-express')

const typeDefs = gql`
  extend type Query {
    departments: [Department] @isAuthenticated
  }

  extend type Mutation {
    createDepartment(
      name: String!
      code: String!
      description: String!
      slug: String!
      pricing: Float!
      seoTitle: String!
      seoKeywords: String!
      seoDescription: String!
    ) : Department @isAuthenticated
  }

  type Department {
    id: ID!
    name: String!
    code: String!
    description: String!
    slug: String!
    pricing: Float!
    seoTitle: String!
    seoKeywords: String!
    seoDescription: String!      
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [
    typeDefs
  ],
  resolvers
}
