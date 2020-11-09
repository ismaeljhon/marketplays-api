const { schemaComposer } = require('graphql-compose')

// input for adding a product
schemaComposer.createInputTC({
  name: 'ProductInput',
  fields: {
    sku: 'String',
    quantity: 'Int'
  }
})

// input for adding a subscription
schemaComposer.createInputTC({
  name: 'SubscriptionInput',
  fields: {
    type: 'MongoID', // subscription type
    services: '[MongoID]' // array of services
  }
})

// use a dedicated array for products and subscriptions
// implementing their respective input types
schemaComposer.getITC('CreateOneOrderInput')
  .removeField(['orderNumber', 'created', 'changed', 'orderlines'])
  .addFields({
    products: '[ProductInput]',
    subscriptions: '[SubscriptionInput]'
  })
