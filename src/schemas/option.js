const mongoose = require('mongoose')
const options = {
  // add discriminators for distinguish properties of certain type
  // in this case, attribute or option
  discriminatorKey: 'kind'
}
const optionSchema = new mongoose.Schema({}, options)
module.exports = optionSchema
