const mongoose = require('mongoose')
const optionSchema = require('../schemas/option')
const generateModel = require('../utils/generate-model')
const {
  difference,
  map
} = require('lodash')

optionSchema.statics.findOrCreate = async (optionNames) => {
  const Option = mongoose.models['Option']
  const existingOptions = await Option.find({
    name: { $in: optionNames }
  })

  // create options that does not exist yet
  const toCreate = difference(optionNames, map(existingOptions, 'name'))
  const newOptionData = toCreate.map(name => {
    return {
      name: name
    }
  })
  const newOptions = await Option.insertMany(newOptionData)
  return [
    ...existingOptions,
    ...newOptions
  ]
}

const Option = generateModel('Option', optionSchema)

module.exports = Option
