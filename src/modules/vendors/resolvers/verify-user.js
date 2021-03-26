const { schemaComposer } = require('graphql-compose')
const vendor = require('../../../models/vendor')

const TC = schemaComposer.getOTC('Vendor')

// add a resolver for verifying a user
TC.addResolver({
  name: 'verifyUser',
  type: 'UserVerifyEmailPayload',
  args: {
    record: 'UserVerifyEmailInput!'
  },
  description: 'Verify a user',
  resolve: async ({ source, args }) => {
    const response = await vendor.verifyUser(args.record)
    return {
      record: {
        email: response.email,
        emailVerified: response.emailVerified
      }
    }
  }
})

schemaComposer.Mutation.addFields({
  verifyUser: TC.getResolver('verifyUser')
})
