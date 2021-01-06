const userSchema = require('../schemas/user')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express')
const generateModel = require('../utils/generate-model')
const Qualification = require('./qualifications')
var ObjectId = require('mongoose').Types.ObjectId

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
const countValidator = function (v) {
  return v.length < 1 || v.length >= 5
}

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
    // make sure email and username are unique
    const existingEmail = await User.findOne({
      email: email
    })
    const existingUserName = await User.findOne({
      username: username
    })
    if (existingEmail) {
      throw new UserInputError('Email already exists')
    }
    if (existingUserName) {
      throw new UserInputError('Username already exists')
    }
    if (mentor === undefined) {
      skills = []
      knowledge = []
    } else {
      const mentor1 = await User.findById(mentor)
      if (!mentor1) {
        throw new UserInputError(
          'Selected mentor does not exist in our database'
        )
      } else if (!mentor1.mentorshipCertified) {
        throw new UserInputError('Mentor is not certified yet')
      } else if (!mentor1.emailVerified) {
        throw new UserInputError('Mentor is not email verified')
      }
      const qualificator = (data) => {
        return data.filter((qua) => ObjectId.isValid(qua))
      }
      const userCustomQua = async (data, type) => {
        let customQualif = data.filter((qua) => !ObjectId.isValid(qua))
        if (customQualif.length === 0) return Promise.resolve([])
        customQualif = customQualif.map((title) => {
          return {
            type,
            title
          }
        })
        return Qualification.create(customQualif)
      }
      const skills_ = (await userCustomQua(skills, 'skill')).map(
        (skill) => `${skill._id}`
      )
      const knowledge_ = (await userCustomQua(knowledge, 'knowledge')).map(
        (knowledge_) => `${knowledge_._id}`
      )
      skills = qualificator([...skills, ...skills_])
      knowledge = qualificator([...knowledge, ...knowledge_])
      let qualifications = await Qualification.find({
        _id: [...skills, ...knowledge]
      })
      if (qualifications.length !== skills.length + knowledge.length) {
        throw new UserInputError(
          'qualification(s) does not exist or duplicate'
        )
      }
      userSchema
        .path('skills')
        .validate(countValidator, `user must pass 5 {PATH} or skip`)
      userSchema
        .path('knowledge')
        .validate(countValidator, `user must pass 5 {PATH} or skip`)
    }

    // apply hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const verificationCode = await bcrypt.hash(
      Date.now() + username,
      SALT_ROUNDS
    )
    const user = new User({
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
    const newUser = await user.save()
    if (newUser === user) return user
  } catch (error) {
    throw error
  }
}

userSchema.statics.verifyEmail = async (verificationCode) => {
  try {
    // make sure email and username are unique
    const user = await User.findOne({
      verificationCode
    })
    if (!user) {
      throw new UserInputError(
        'no user associated with this verification code'
      )
    } else if (user.emailVerified) {
      throw new UserInputError('user verified already')
    }
    const res = await User.updateOne(
      { _id: user._id },
      { emailVerified: true }
    )
    return res.nModified > 0
  } catch (error) {
    throw error
  }
}

const User = generateModel('User', userSchema)

module.exports = User
