const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

// add a resolver for verifying a user
UserTC.addResolver({
  name: 'verifyUser',
  type: 'UserVerifyEmailPayload',
  args: {
    record: 'UserVerifyEmailInput!'
  },
  description: 'Verify a user',
  resolve: async ({ source, args }) => {
    const response = await User.verifyUser(args.record)
    return {
      record: {
        email: response.email,
        emailVerified: response.emailVerified
      }
    }
  }
})

schemaComposer.Mutation.addFields({
  verifyUser: UserTC.getResolver('verifyUser')
})
