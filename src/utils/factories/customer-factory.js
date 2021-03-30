const faker = require('faker')

const CustomerFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    const address = [
      faker.address.streetAddress(),
      faker.address.city(),
      faker.address.state(),
      faker.address.countryCode(),
      faker.address.zipCode()
    ].join(' ')

    return {
      firstName: firstName,
      middleName: faker.name.lastName(),
      lastName: lastName,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20),
      contactNumber: faker.phone.phoneNumber(),
      address: address,
      interestedIn: faker.random.words(6).split(' ')
    }
  }
}

module.exports = {
  CustomerFactory: CustomerFactory
}
