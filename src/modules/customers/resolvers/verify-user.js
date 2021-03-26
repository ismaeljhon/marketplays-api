const { schemaComposer } = require('graphql-compose')
const Customer = require('../../../models/customer')
const CustomerTC = schemaComposer.getOTC('Customer')

// add a resolver for verifying a user
CustomerTC.addResolver({
  name: 'verifyUser',
  type: 'UserVerifyEmailPayload',
  args: {
    record: 'UserVerifyEmailInput!'
  },
  description: 'Verify a user',
  resolve: async ({ source, args }) => {
    const response = await Customer.verifyUser(args.record)
    return {
      record: {
        email: response.email,
        emailVerified: response.emailVerified
      }
    }
  }
})

schemaComposer.Mutation.addFields({
  verifyUser: CustomerTC.getResolver('verifyUser')
})
