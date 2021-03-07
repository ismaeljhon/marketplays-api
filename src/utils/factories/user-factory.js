const faker = require('faker')
const generateFakeAccess = require('../../utils/generate-fake-accessType')

const UserFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    return {
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20),
      access: generateFakeAccess()
    }
  }
}

module.exports = {
  UserFactory: UserFactory
}
