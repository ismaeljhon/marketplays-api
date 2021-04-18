const request = require('supertest')
const app = require('../../app')

const fs = require('mz/fs')
const faker = require('faker')
const expect = require('expect')
var path = require('path')
describe('POST Upload file', () => {
  it('should upload the test file to images', () => {
    const randomNo = faker.random.number({
      'min': 1,
      'max': 3
    })
    const filePath = `${__dirname}/sampleFiles/photo${randomNo}.jpg`
    const fileName = path.basename(filePath)

    fs.exists(filePath).then(exists => {
      expect(exists).toBeTruthy()
      if (!exists) throw new Error('file does not exist')

      var file = fs.readFileSync(filePath)

      var encodedFile = file.toString('base64')
      const buf = Buffer.from(encodedFile, 'base64')

      return request(app)
        .post('/uploadFile')
        .attach('file', buf, fileName).then((res) => {
          const { success, message, filePath } = res.body
          expect(success).toBeTruthy()
          expect(message).toBe('Uploaded successfully')
          expect(typeof filePath).toBeTruthy()
          // store file data for following tests
        })
    })
  })
})
