const User = require('../models/user')
const Token = require('./token')
const { UserFactory } = require('./factories')

const generateToken = async (_) => {
  const testUser = UserFactory.generate()
  const user = await User.signup(testUser)
  const token = await Token.create(user._id)
  return token
}

module.exports = { generateToken }
