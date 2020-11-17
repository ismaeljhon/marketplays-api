const faker = require('faker')

const JobCategoryFactory = {
  generate: () => {
    const name = faker.name.jobArea()
    return {
      name: name,
      slug: faker.helpers.slugify(name),
      seoTitle: name,
      seoKeywords: faker.lorem.words(3),
      seoDescription: faker.lorem.sentence(20)
    }
  }
}

module.exports = {
  JobCategoryFactory: JobCategoryFactory
}
