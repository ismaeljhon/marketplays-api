const faker = require('faker')
const { generateToken } = require('../generate-token')
const GmailUserFactory = {

  generate: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    return {
      fullName: faker.name,
      givenName: firstName,
      familyName: lastName,
      imageURL: faker.image.imageUrl(400, 400, 'people'),
      email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
      idToken: generateToken()
    }
  }
}

module.exports = {
  GmailUserFactory: GmailUserFactory
}
