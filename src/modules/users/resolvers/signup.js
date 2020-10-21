const { schemaComposer } = require('graphql-compose')
const { UserInputError } = require('apollo-server-express')
const User = require('../../../models/user')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12

const UserTC = schemaComposer.getOTC('User')

// add types for signup
schemaComposer.createInputTC({
  name: 'SignupUserInput',
  fields: {
    fullName: 'String!',
    email: 'String!',
    password: 'String!'
  }
})
const UserSignupPayload = schemaComposer.createObjectTC({
  name: 'UserSignupPayload',
  fields: {
    recordId: 'MongoID',
    record: 'User',
    error: 'ErrorInterface'
  }
})

// remove create user and replace with signup
schemaComposer.Mutation.removeField('UserCreateOne')
UserTC.addResolver({
  name: 'UserSignup',
  type: UserSignupPayload,
  args: {
    record: 'SignupUserInput!'
  },
  resolve: async ({ source, args }) => {
    const data = args.record
    try {
      const existingUser = await User.findOne({
        email: data.email
      })

      if (existingUser) {
        throw new UserInputError('User already exists')
      }

      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        hashedPassword: hashedPassword
      })

      return {
        recordId: user._id,
        record: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      }
    } catch (error) {
      throw error
    }
  }
})
schemaComposer.Mutation.addFields({
  UserSignup: UserTC.getResolver('UserSignup')
})
