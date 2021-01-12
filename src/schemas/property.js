const mongoose = require('mongoose')

// discriminator key
const dKey = 'kind'

// item kinds
const enumPropertyKind = {
  ATTRIBUTE: 'Attribute',
  OPTION: 'Option'
}
const propertySchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
    enum: Object.keys(enumPropertyKind)
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    validate: {
      // check if the code is unique per type
      validator: async function (value) {
        const Property = mongoose.models['Property'] // @TODO - is this accessible via `this`?
        const result = await Property.countDocuments({
          code: value,
          kind: this.kind
        })
        return result === 0
      },
      message: props => `Code ${props.value} already in use.`
    }
  }
})

// set discriminator Key
propertySchema.set('discriminatorKey', dKey)

module.exports = propertySchema
