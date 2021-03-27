const vendorSchema = require('../schemas/vendor')
const generateModel = require('../utils/generate-model')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express')
const Shop = require('./shop')
const SALT_ROUNDS = 12

// statics
/**
 * Registers a user
 * Also applies hash to the password automatically
 *
 * @param {Object} payload User payload data
 * @param {String} payload.firstName first name of the user
 * @param {String} payload.middleName middle name of the user
 * @param {String} payload.lastName lastname name of the user
 * @param {String} payload.email Unique email address of the user
 * @param {String} payload.password Raw password of the user
 * @param {String} payload.access Raw password of the user
 *
 * @return {mongoose.model} Resulting user
 */
vendorSchema.statics.SignupUser = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  contactNumber,
  businessName,
  businessContactNumber,
  street,
  city,
  state,
  countryCode,
  zipCode
}) => {
  try {
    // make sure email is unique
    const existingUser = await Vendor.findOne({
      email: email
    })
    if (existingUser) {
      throw new UserInputError('User already exists')
    }

    // apply hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await Vendor.create({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
      contactNumber: contactNumber
    })

    if (user) {
      await Shop.create({
        businessName: businessName,
        contactNumber: contactNumber,
        street: street,
        city: city,
        state: state,
        countryCode: countryCode,
        zipCode: zipCode,
        ownBy: user.id
      })
    }

    return user
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {Object} payload payload data
 * @param {String} payload.code verification code
 *
 * @return {Object} email and verification status of the user
 */
vendorSchema.statics.verifyUser = async ({
  code
} = {}) => {
  if (!code) {
    throw new UserInputError('Verification code not provided.')
  }

  // mark user, of verification code, as verified
  const user = await Vendor.findOneAndUpdate(
    {
      verificationCode: code,
      emailVerified: false // only verify ones that are not
    },
    { $set: { emailVerified: true } }, // @TODO - do we unset the verification code as well?
    {
      new: true,
      useFindAndModify: false
    }
  )
  if (!user) {
    // just throw a generic error message for security reasons
    throw new UserInputError('User validation failed')
  }
  return {
    email: user.email,
    emailVerified: user.emailVerified
  }
}

const Vendor = generateModel('Vendor', vendorSchema, User)

module.exports = Vendor
