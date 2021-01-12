const faker = require('faker')

const ServiceFactory = {
  generate: () => {
    const name = faker.lorem.words(3)
    return {
      name: name,
      code: faker.random.alphaNumeric(4).toUpperCase(),
      description: faker.lorem.sentence(20),
      shortDescription: faker.lorem.sentence(6),
      price: parseFloat(faker.commerce.price(5, 300)),
      slug: faker.helpers.slugify(name),
      workforceThreshold: faker.random.number(20),
      tags: [faker.random.word(), faker.random.word()],
      seoTitle: name,
      seoKeywords: faker.lorem.words(3),
      seoDescription: faker.lorem.sentence(20),
      currency: faker.finance.currencyCode(),
      image: faker.image.business()
    }
  }
}

module.exports = {
  ServiceFactory: ServiceFactory
}
