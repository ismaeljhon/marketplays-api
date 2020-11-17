const faker = require('faker')

const JobFactory = {
  generate: () => {
    const title = faker.name.jobArea()
    return {
      title: title,
      slug: faker.helpers.slugify(title),
      description: faker.name.jobDescriptor(),
      instructions: faker.lorem.paragraph(7),
      biddable: faker.random.boolean(),
      openingMarketBid: faker.commerce.price(10, 300),
      type: faker.random.arrayElement(['hourly', 'project']),
      timeframe: faker.random.number(20) * 60, // minutes
      seoTitle: title,
      seoKeywords: faker.lorem.words(3),
      seoDescription: faker.lorem.sentence(20),
      currency: faker.finance.currencyCode()
    }
  }
}

module.exports = {
  JobFactory: JobFactory
}
