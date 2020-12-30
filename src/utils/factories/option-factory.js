const faker = require('faker')

const OptionFactory = {
  generate: () => {
    return {
      name: faker.random.word(),
      code: faker.random.alphaNumeric(5)
    }
  }
}

module.exports = {
  OptionFactory: OptionFactory
}
