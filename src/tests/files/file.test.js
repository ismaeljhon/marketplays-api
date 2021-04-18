
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
    const fpath = `${__dirname}/sampleFiles/photo${randomNo}.jpg`
    const fileName = path.basename(fpath)

    fs.exists(fpath).then(async exists => {
      expect(exists).toBeTruthy()
      if (!exists) throw new Error('file does not exist')

      var file = fs.readFileSync(fpath)
      var encodedFile = file.toString('base64')
      const buf = Buffer.from(encodedFile, 'base64')

      const res = await request(app)
        .post('/uploadFile')
        .attach('file', buf, fileName)
      const { success, message } = res.body
      expect(success).toBeTruthy()
      expect(message).toBe('Uploaded successfully')
      // store file data for following tests
    })
  })

  it('should delete files in upload directory', () => {
    const path = './uploads/'
    fs.readdirSync(path).forEach(file => {
      // eslint-disable-next-line no-console
      var curPath = path + '/' + file
      fs.unlinkSync(curPath)
    })
  })
})
