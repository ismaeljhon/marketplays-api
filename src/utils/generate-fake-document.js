// generates a fake test document
const faker = require('faker')
const generateFakeDocument = (args) => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const fakeDocument = {
    name: (args && args.name) ? args.name : `${firstName} ${lastName}`,
    address: {
      street: (args && args.address && args.address.street) ? args.address.street : faker.address.streetName(),
      city: (args && args.address && args.address.city) ? args.address.city : faker.address.city(),
      state: (args && args.address && args.address.state) ? args.address.state : faker.address.state(),
      country: (args && args.address && args.address.country) ? args.address.country : faker.address.country(),
      zipCode: (args && args.address && args.address.zipCode) ? args.address.zipCode : faker.address.zipCode()
    },
    email: (args && args.email) ? args.email : faker.internet.email(firstName, lastName, faker.internet.domainName()),
    age: (args && args.age) ? args.age : faker.random.number(50)
  }
  return fakeDocument
}

module.exports = generateFakeDocument
