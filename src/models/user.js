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
 * @param {String} payload.fullName Full name of the user
 * @param {String} payload.email Unique email address of the user
 * @param {String} payload.fullName Raw password of the user
 *
 * @return {mongoose.model} Resulting user
 */

userSchema.statics.signup = async ({
  firstName,
  lastName,
  username,
  email,
  password,
  mentor,
  skills,
  knowledge
}) => {
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
    const verificationCode = await bcrypt.hash(
      Date.now() + username,
      SALT_ROUNDS
    )
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      hashedPassword,
      mentor,
      skills,
      knowledge,
      verificationCode
    })
    return user
  } catch (error) {
    throw error
  }
}

const User = generateModel('User', userSchema)

module.exports = User
