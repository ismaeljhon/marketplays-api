const { schemaComposer } = require('graphql-compose')

const SubscriptionTC = schemaComposer.getOTC('Subscription')
const ProductTC = schemaComposer.getOTC('Product')
const OrderlineTC = schemaComposer.getOTC('Orderline')

// create lineItem union type to represent a line item
// than can either be a product or a subscription
const LineItemTC = schemaComposer.createUnionTC({
  name: 'LineItem',
  types: [ SubscriptionTC, ProductTC ]
})
OrderlineTC.setField('item', {
  type: LineItemTC
})
