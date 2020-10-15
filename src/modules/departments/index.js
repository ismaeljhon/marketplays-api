const { gql } = require('apollo-server-express')

const typeDefs = gql`
  extend type Query {
    department(id: ID!): Department @isAuthenticated
    departments: [Department] @isAuthenticated
  }

  extend type Mutation {
    createDepartment(
      name: String!
      code: String!
      description: String
      slug: String
      pricing: Float!
      seoTitle: String
      seoKeywords: String
      seoDescription: String
    ) : Department @isAuthenticated

    updateDepartment(
      id: ID!
      name: String!
      code: String!
      description: String
      slug: String
      pricing: Float!
      seoTitle: String
      seoKeywords: String
      seoDescription: String
    ) : Department @isAuthenticated

    deleteDepartment(
      id: ID!
    ) : Department @isAuthenticated    
  }

  type Department {
    id: ID!
    name: String!
    code: String!
    description: String
    slug: String
    pricing: Float!
    seoTitle: String
    seoKeywords: String
    seoDescription: String
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [
    typeDefs
  ],
  resolvers
}
