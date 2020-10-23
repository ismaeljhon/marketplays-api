const mongoose = require('mongoose')
const { UserInputError } = require('apollo-server-express')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')
const SALT_ROUNDS = 12

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date
  },
  teamLeadOf: {
    type: [String]
  }
})

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
  fullName,
  email,
  password
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
    const user = await User.create({
      fullName: fullName,
      email: email,
      hashedPassword: hashedPassword
    })
    return user
  } catch (error) {
    throw error
  }
}

// plugins
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
