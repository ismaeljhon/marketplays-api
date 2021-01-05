// @TODO - prefixing the file name with '_' for this file is just a temporary workaround
// to ensure this model loads first
// the abstraction layer to handle this is still to be written
/**
 * Property abstract model
 * This is where all property instances (eg Attribute, Option) will inherit from
 * item static methods, functions are defined by this abstract model
 */
const propertySchema = require('../schemas/property')
const generateModel = require('../utils/generate-model')
const Property = generateModel('Property', propertySchema)
const {
  map,
  keyBy,
  difference
} = require('lodash')

propertySchema.statics.findOrCreate = async function (propertyData) {
  // retrieve existing properties
  let codes = map(propertyData, 'code')
  let existingProperties = await this.find({
    code: { $in: codes }
  })

  // determine properties that still need to be created
  let propertyDataMap = keyBy(propertyData, 'code')
  let pendingPropertyCodes = difference(codes, map(existingProperties, 'code'))

  // create pending properties
  const newPropertiesData = pendingPropertyCodes.map(code => {
    return propertyDataMap[code]
  })
  const newProperties = await this.insertMany(newPropertiesData)

  // sort data according to how the input has been sorted
  const allProperties = keyBy([
    ...existingProperties,
    ...newProperties
  ], 'code')
  const sorted = propertyData.map(data => {
    return allProperties[data.code]
  })
  return sorted
}

module.exports = Property
