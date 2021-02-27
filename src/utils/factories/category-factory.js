const faker = require('faker')

const CategoryFactory = {
  generate: () => {
    const name = faker.lorem.words(3)
    return {
      name: name,
      code: faker.random.alphaNumeric(4).toUpperCase(),
      description: faker.lorem.sentence(20),
      slug: faker.helpers.slugify(name),
      seoTitle: name,
      seoKeywords: faker.lorem.words(3),
      seoDescription: faker.lorem.sentence(20)
    }
  }
}

module.exports = {
  CategoryFactory: CategoryFactory
}
