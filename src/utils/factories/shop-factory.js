const faker = require('faker')

const ShopFactory = {
  generate: () => {
    return {
      name: faker.company.companyName(),
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
  ShopFactory: ShopFactory
}
