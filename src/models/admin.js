const adminchema = require('../schemas/admin')
const generateModel = require('../utils/generate-model')
const User = require('./user')

const Admin = generateModel('Admin', adminchema, User)

module.exports = Admin
