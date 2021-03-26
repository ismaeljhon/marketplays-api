const faker = require('faker')

const VendorFactory = {
  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    return {
      firstName: firstName,
      middleName: faker.name.lastName(),
      lastName: lastName,
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      password: faker.internet.password(20),
      businessName: faker.company.companyName(),
      contactNumber: faker.phone.phoneNumber(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      countryCode: faker.address.countryCode(),
      zipCode: faker.address.zipCode(),
      active: faker.random.boolean()
    }
  }
}

module.exports = {
  VendorFactory: VendorFactory
}
