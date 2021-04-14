const userSchema = require('../schemas/user')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express')
const generateModel = require('../utils/generate-model')

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
userSchema.statics.SignupUser = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  contactNumber
}, userType) => {
  try {
    // make sure email is unique
    const existingUser = await User.findOne({
      email: email
    })
    if (existingUser) {
      throw new UserInputError('User already exists')
    }

    // apply hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
      contactNumber: contactNumber
    })
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
userSchema.statics.verifyUser = async ({
  code
} = {}) => {
  if (!code) {
    throw new UserInputError('Verification code not provided.')
  }

  // mark user, of verification code, as verified
  const user = await User.findOneAndUpdate(
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

userSchema.statics.LoginUser = async ({
  email,
  password
} = {}) => {
  if (!password || !email) {
    throw new UserInputError('Email and Password is both required.')
  }

  // mark user, of verification code, as verified

  const user = await User.findOne({ email: email })
  if (!user) {
    throw new UserInputError('User validation failed')
  }
  const match = await bcrypt.compare(password, user.hashedPassword)

  if (!match) {
    // just throw a generic error message for security reasons
    throw new UserInputError('User validation failed')
  }
  return user
}

userSchema.statics.LoginViaGmail = async ({
  fullName,
  givenName,
  familyName,
  imageURL,
  email,
  idToken
} = {}) => {
  const user = await User.findOne({ email: email })
  if (!user) {
    // user is not yet add. add;
    const newUser = await User.create({
      gmailFullName: fullName,
      firstName: givenName,
      lastName: familyName,
      email: email,
      ImageURL: imageURL,
      gmailTokenId: idToken
    })
    return newUser
  }
  return user
}

const User = generateModel('User', userSchema)
module.exports = User
