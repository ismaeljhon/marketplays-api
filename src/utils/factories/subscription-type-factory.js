const faker = require('faker')

const SubscriptionTypeFactory = {
  generate: () => {
    return {
      name: faker.lorem.words(5),
      description: faker.lorem.sentence(20),
      shortDescription: faker.lorem.sentence(10)
    }
  }
}

module.exports = {
  SubscriptionTypeFactory: SubscriptionTypeFactory
}
