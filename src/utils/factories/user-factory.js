const faker = require('faker')

const UserFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const username = faker.internet.userName(firstName, lastName)
    const verificationCode = faker.random.uuid()
    return {
      firstName: `${firstName}`,
      lastName: `${lastName}`,
      username,
      email: faker.internet.email(
        firstName,
        lastName,
        faker.internet.domainName()
      ),
      verificationCode,
      password: faker.internet.password(20)
    }
  }
}

module.exports = {
  UserFactory: UserFactory
}
