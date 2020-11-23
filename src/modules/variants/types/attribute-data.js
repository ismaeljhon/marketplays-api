const { schemaComposer } = require('graphql-compose')
const Schema = require('mongoose')

schemaComposer.createObjectTC({
  name: 'AttributeData',
  fields: {
    attribute: {
      type: Schema.Types.ObjectId
    },
    option: {
      type: Schema.Types.ObjectId
    }
  }
})
