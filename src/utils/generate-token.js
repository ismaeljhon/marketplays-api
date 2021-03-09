const User = require('../models/user')
const faker = require('faker')
const bcrypt = require('bcrypt')
const Token = require('./token')

const SALT_ROUNDS = 12

const firstName = faker.name.firstName()
const lastName = faker.name.lastName()
const middleName = faker.name.lastName()

const generateToken = async (_) => {
  const testUser = {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
    hashedPassword: await bcrypt.hash(faker.internet.password(20), SALT_ROUNDS)
  }
  const user = await User.create(testUser)
  const token = await Token.create(user._id)
  return token
}

module.exports = { generateToken }
