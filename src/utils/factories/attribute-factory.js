const faker = require('faker')

const AttributeFactory = {
  generate: () => {
    return {
      name: faker.random.word(),
      code: faker.random.alphaNumeric(5)
    }
  }
}

module.exports = {
  AttributeFactory: AttributeFactory
}
