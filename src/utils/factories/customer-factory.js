const faker = require('faker')

const CustomerFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const address = faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}, {{address.country}}')
    return {
      name: `${firstName} ${lastName}`,
      address: address,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName)
    }
  }
}

module.exports = {
  CustomerFactory: CustomerFactory
}
