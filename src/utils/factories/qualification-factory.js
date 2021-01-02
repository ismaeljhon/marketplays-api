const faker = require('faker')

const QualificationFactory = {
  generateSkill: () => {
    const title = faker.name.jobType()
    const type = 'skill'
    return {
      title: `${title}`,
      type: `${type}`
    }
  },
  generateKnowledge: () => {
    const title = faker.name.jobType()
    const type = 'knowledge'
    return {
      title: `${title}`,
      type: `${type}`
    }
  }
}

module.exports = {
  QualificationFactory: QualificationFactory
}
