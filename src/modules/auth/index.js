const { gql } = require('apollo-server-express')

const typeDefs = gql`
  extend type Query {
    me: User @isAuthenticated
  }

  extend type Mutation {
    login(
      email: String!,
      password: String!
    ): AuthData

    SignupUser(
      firstName: String!,
      middleName: String!,
      lastName: String!,
      email: String!,
      password: String!,
      access : String
    ): User
  }

  type AuthData {
    user: User
    token: String!
    tokenExpiration: String!
  }

  type User {
    id: ID!
    firstName: String!,
    middleName: String!,
    lastName: String!,
    email: String!
    password: String!
    teamLeadOf: [ Department ]
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [
    typeDefs
  ],
  resolvers
}
