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
  return this.find({
    code: { $in: codes }
  })
    .then(existingProperties => {
      // determine properties that still need to be created
      let propertyDataMap = keyBy(propertyData, 'code')
      let pendingPropertyCodes = difference(codes, map(existingProperties, 'code'))

      // create pending properties
      const newPropertiesData = pendingPropertyCodes.map(code => {
        return propertyDataMap[code]
      })
      return this.insertMany(newPropertiesData)
        .then(newProperties => {
          return keyBy([
            ...existingProperties,
            ...newProperties
          ], 'code')
        })
    })
    .then(allProperties => {
      // sort data according to how the input has been sorted
      const sorted = propertyData.map(data => {
        return allProperties[data.code]
      })
      return sorted
    })
    .catch(errors => {
      throw errors
    })
}

module.exports = Property
