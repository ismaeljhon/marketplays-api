const { schemaComposer } = require('graphql-compose')
const Customer = require('../../../models/customer')

const CustomerTC = schemaComposer.getOTC('Customer')

CustomerTC.addResolver({
  name: 'SignupCustomerUser',
  type: 'CustomerUserSignupPayload',
  args: {
    record: 'SignupCustomerUserInput!'
  },
  description: 'Registers a Customer',
  resolve: async ({ source, args }) => {
    const user = await Customer.SignupCustomerUser(args.record)
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
  SignupCustomerUser: CustomerTC.getResolver('SignupCustomerUser')
})
