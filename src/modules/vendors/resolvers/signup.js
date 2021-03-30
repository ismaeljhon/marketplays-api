const { schemaComposer } = require('graphql-compose')
const Vendor = require('../../../models/vendor')

const VendorTC = schemaComposer.getOTC('Vendor')

VendorTC.addResolver({
  name: 'SignupVendorUser',
  type: 'VendorUserSignupPayload',
  args: {
    record: 'SignupVendorUserInput!'
  },
  description: 'Registers a user',
  resolve: async ({ source, args }) => {
    const user = await Vendor.SignupVendorUser(args.record)

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
  SignupVendorUser: VendorTC.getResolver('SignupVendorUser')
})
