const faker = require('faker')

const VendorFactory = {
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
      phoneNumber: faker.phone.phoneNumber(),
      businessName: faker.company.companyName(),
      businessAddress: address,
      dateTimeForVerification: faker.date.future().toLocaleDateString(),
      validId: faker.image.imageUrl(),
      validIdWithSelfie: faker.image.imageUrl(),
      hasExistingMarketplaysPlatform: faker.random.boolean()
    }
  }
}

module.exports = {
  VendorFactory: VendorFactory
}
