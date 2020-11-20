const faker = require('faker')

const AttributeFactory = {
  generate: () => {
    return {
      name: faker.lorem.words(3)
    }
  }
}

module.exports = {
  AttributeFactory: AttributeFactory
}
