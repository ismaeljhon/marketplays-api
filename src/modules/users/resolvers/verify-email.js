const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

UserTC.addResolver({
  name: 'verifyEmail',
  type: 'VerifyPayload',
  args: {
    verificationCode: 'String!'
  },
  description: 'Verify a user email',
  resolve: async ({ args }) => {
    try {
      const response = await User.verifyEmail(args.verificationCode)
      return { record: response }
    } catch (err) {
      return {
        error: { message: err.message }
      }
    }
  }
})
schemaComposer.Mutation.addFields({
  verifyEmail: UserTC.getResolver('verifyEmail')
})
