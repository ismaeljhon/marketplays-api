const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

// remove create user and replace with signup
schemaComposer.Mutation.removeField('createOneUser')
UserTC.addResolver({
  name: 'signup',
  type: 'UserSignupPayload',
  args: {
    record: 'SignupUserInput!'
  },
  description: 'Registers a user',
  resolve: async ({ source, args }) => {
    const user = await User.signup(args.record)
    return {
      recordId: user._id,
      record: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        verificationCode: user.verificationCode
      }
    }
  }
})
schemaComposer.Mutation.addFields({
  signup: UserTC.getResolver('signup')
})
