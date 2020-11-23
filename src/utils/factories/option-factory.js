const faker = require('faker')

const OptionFactory = {
  generate: () => {
    return {
      name: faker.random.word()
    }
  }
}

module.exports = {
  OptionFactory: OptionFactory
}
