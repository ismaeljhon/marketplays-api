const faker = require('faker')

const AttributeFactory = {
  generate: () => {
    return {
      name: faker.random.word()
    }
  }
}

module.exports = {
  AttributeFactory: AttributeFactory
}
