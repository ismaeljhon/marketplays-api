const customerSchema = require('../schemas/customer')

const generateModel = require('../utils/generate-model')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express')
const getModel = require('../utils/get-model')
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
customerSchema.statics.SignupCustomerUser = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  contactNumber,
  address,
  interestedIn
}) => {
  try {
    // make sure email is unique
    const existingUser = await Customer.findOne({
      email: email
    })
    if (existingUser) {
      throw new UserInputError('User already exists')
    }

    // apply hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await Customer.create({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
      contactNumber: contactNumber,
      address: address,
      interestedIn: interestedIn
    })
    return user
  } catch (error) {
    throw error
  }
}

const Customer = generateModel('Customer', customerSchema, {
  baseModel: getModel('User') // configure discriminator
})
module.exports = Customer
