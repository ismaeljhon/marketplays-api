const faker = require('faker')

const CustomerFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    return {
      firstName: firstName,
      middleName: faker.name.lastName(),
      lastName: lastName,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20),
      contactNumber: faker.phone.phoneNumber()
    }
  }
}

module.exports = {
  CustomerFactory: CustomerFactory
}
