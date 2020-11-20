const faker = require('faker')

const OptionFactory = {
  generate: () => {
    return {
      name: faker.lorem.words(3)
    }
  }
}

module.exports = {
  OptionFactory: OptionFactory
}
