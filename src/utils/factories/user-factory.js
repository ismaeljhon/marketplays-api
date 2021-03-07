const faker = require('faker')

const UserFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    return {
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20),
      isEcommerce: faker.random.boolean(),
      isFTP: faker.random.boolean(),
      isSocialMedia: true
    }
  }
}

module.exports = {
  UserFactory: UserFactory
}
