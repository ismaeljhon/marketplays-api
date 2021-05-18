const adminchema = require('../schemas/admin')
const generateModel = require('../utils/generate-model')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express')
const SALT_ROUNDS = 12
const getModel = require('../utils/get-model')

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
adminchema.statics.SignupUser = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  contactNumber,
  teamLeadOf,
  projectManagerOf
}) => {
  try {
    // make sure email is unique
    const existingUser = await Admin.findOne({
      email: email
    })
    if (existingUser) {
      throw new UserInputError('User already exists')
    }

    // apply hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await Admin.create({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
      contactNumber: contactNumber,
      teamLeadOf: teamLeadOf,
      projectManagerOf: projectManagerOf
    })
    return user
  } catch (error) {
    throw error
  }
}

const Admin = generateModel('Admin', adminchema, {
  baseModel: getModel('User') // configure discriminator
})
module.exports = Admin
