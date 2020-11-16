const { customAlphabet } = require('nanoid')

const generateId = () => {
  const nanoid = customAlphabet('123456789ABCDEFGHJKLPRSTXYZ', 12)
  return nanoid()
}

module.exports = generateId
