const mongoose = require('mongoose')
const options = {
  // add discriminators for distinguish properties of certain type
  // in this case, attribute or option
  discriminatorKey: 'kind'
}
const propertySchema = new mongoose.Schema({
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
}, options)

module.exports = propertySchema
