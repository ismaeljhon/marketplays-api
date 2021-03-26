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
/*

UserTC.addResolver({
  name: 'SignupAdminUser',
  type: 'UserSignupPayload',
  args: {
    record: 'SignupAdminUserInput!'
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
  SignupAdminUser: UserTC.getResolver('SignupAdminUser')
})

UserTC.addResolver({
  name: 'SignupVendorUser',
  type: 'VendorUserSignupPayload',
  args: {
    record: 'SignupVendorUserInput!'
  },
  description: 'Registers a user',
  resolve: async ({ source, args }) => {
    const user = await User.SignupUser(args.record)

    // also add shop info
    Shop.create({
      name: args.record.businessName,
      contactNumber: args.record.contactNumber,
      street: args.record.street,
      city: args.record.city,
      state: args.record.state,
      countryCode: args.record.countryCode,
      zipCode: args.record.zipCode
    })

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
  SignupVendorUser: UserTC.getResolver('SignupVendorUser')
})

UserTC.addResolver({
  name: 'SignupTFPUser',
  type: 'TFPUserSignupPayload',
  args: {
    record: 'SignupTFPUserInput!'
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
  SignupTFPUser: UserTC.getResolver('SignupTFPUser')
})

*/
