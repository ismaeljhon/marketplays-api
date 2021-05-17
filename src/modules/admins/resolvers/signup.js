const { schemaComposer } = require('graphql-compose')
const Admin = require('../../../models/admin')

const AdminTC = schemaComposer.getOTC('Admin')

AdminTC.addResolver({
  name: 'SignupAdminUser',
  type: 'AdminUserSignupPayload',
  args: {
    record: 'SignupAdminUserInput!'
  },
  description: 'Registers a Admin',
  resolve: async ({ source, args }) => {
    const user = await Admin.SignupUser(args.record)
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
  SignupAdminUser: AdminTC.getResolver('SignupAdminUser')
})
