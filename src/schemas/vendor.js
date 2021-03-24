
const mongoose = require('mongoose')
const Schema = require('mongoose')

const vendorUserSchema = new mongoose.Schema({
  shops: {
    type: [Schema.Types.ObjectId], // shops
    default: []
  }
})

module.exports = vendorUserSchema
