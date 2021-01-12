const mongoose = require('mongoose')
const options = {
  // add discriminators for distinguish properties of certain type
  // in this case, product or service
  discriminatorKey: 'kind'
}

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  }
}, options)

module.exports = productSchema
