const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')
// todo add other sign up

const UserTC = schemaComposer.getOTC('User')

// remove create user and replace with signup
schemaComposer.Mutation.removeField('createOneUser')
UserTC.addResolver({
  name: 'SignupUser',
  type: 'UserSignupPayload',
  args: {
    record: 'SignupUserInput!'
  },
  description: 'Registers a user',
  resolve: async ({ source, args }) => {
    const user = await User.SignupUser(args.record)
    return {
      recordId: user._id,
      record: {
        _id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        verificationCode: user.verificationCode
      }
    }
  }
})
schemaComposer.Mutation.addFields({
  SignupUser: UserTC.getResolver('SignupUser')
})

UserTC.addResolver({
  name: 'LoginUser',
  type: 'LoginUserPayload',
  args: {
    record: 'LoginUserInput!'
  },
  description: 'Login User',
  resolve: async ({ source, args }) => {
    const user = await User.LoginUser(args.record)
    return {
      recordId: user._id,
      record: {
        email: user.email,
        _id: user._id
      }
    }
  }
})
schemaComposer.Mutation.addFields({
  LoginUser: UserTC.getResolver('LoginUser')
})
