const faker = require('faker')

const DepartmentFactory = {
  generate: () => {
    const name = faker.lorem.words(3)
    return {
      name: name,
      code: faker.random.alphaNumeric(4).toUpperCase(),
      description: faker.lorem.sentence(20),
      slug: faker.helpers.slugify(name),
      pricing: faker.commerce.price(5, 300),
      seoTitle: name,
      seoKeywords: faker.lorem.words(3),
      seoDescription: faker.lorem.sentence(20)
    }
  }
}

module.exports = {
  DepartmentFactory: DepartmentFactory
}
