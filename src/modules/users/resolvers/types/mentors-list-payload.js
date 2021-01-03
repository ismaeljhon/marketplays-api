const { schemaComposer } = require('graphql-compose')
schemaComposer.createObjectTC({
  name: 'MentorsListPayload',
  fields: {
    record: '[User]',
    error: 'ErrorInterface'
  }
})
