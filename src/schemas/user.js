const mongoose = require('mongoose')
const Schema = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
/* @param {Request} request object with json encoded body in format
 *   {first_name: String, last_name: String, email: String, username: String,
 *       password: String, confirm_password: String, agree_to_terms: Boolean, skills: Array<ObjectId>,
 *       knowledge: Array<ObjectId>, mentor: ObjectId}
 * @param {Response} response object that send json encoded object in format
 *   {status: Number, error_messages: Array<String>, success: Boolean, data: Array<any>}
 */
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  skills: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  knowledge: {
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  mentor: {
    type: Schema.Types.ObjectId,
    required: true
  },
  certified_for_mentorship: {
    type: Boolean, // department
    required: false,
    default: false
  },
  email_verified: {
    type: Boolean, // department
    required: false,
    default: false
  },
  verification_code: {
    type: String, // department
    required: true
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
    type: [Schema.Types.ObjectId], // department
    default: []
  },
  projectManagerOf: {
    type: [Schema.Types.ObjectId], // service
    default: []
  }
})

// plugins
userSchema.plugin(uniqueValidator)

module.exports = userSchema
