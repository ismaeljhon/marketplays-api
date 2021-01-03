const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

UserTC.addResolver({
  name: 'verifyEmail',
  type: 'Boolean',
  args: {
    verificationCode: 'String!'
  },
  description: 'Verify a user email',
  resolve: async ({ source, args }) => {
    const verified = User.verifyEmail(args.verificationCode)
    return verified
  }
})
schemaComposer.Mutation.addFields({
  verifyEmail: UserTC.getResolver('verifyEmail')
})
