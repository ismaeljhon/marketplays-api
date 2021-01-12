const faker = require('faker')

const ProductFactory = {
  generate: () => {
    const sku = faker.random.alphaNumeric(5).toUpperCase()
    return {
      sku: sku,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(10, 2000))
    }
  }
}

module.exports = {
  ProductFactory: ProductFactory
}
