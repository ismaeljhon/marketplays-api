const faker = require('faker')

const UserFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const username = faker.internet.userName(firstName, lastName)
    return {
      firstName,
      lastName,
      username,
      email: faker.internet.email(
        firstName,
        lastName,
        faker.internet.domainName()
      ),
      password: faker.internet.password(20)
    }
  }
}

module.exports = {
  UserFactory: UserFactory
}
