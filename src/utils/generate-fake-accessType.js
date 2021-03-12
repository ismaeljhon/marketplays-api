// generates a fake test document
const faker = require('faker')
const generateFakeAccess = () => {
  const access = ['ftp', 'store']

  let accessCount = faker.random.number({ min: 0, max: 2 })

  switch (accessCount) {
    case 1:
      var shuffled = access.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 1)[0]
    case 2 :
      return access.join(',')
    default: return ''
  }
}

module.exports = generateFakeAccess
