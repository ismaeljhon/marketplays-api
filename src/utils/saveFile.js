const fs = require('fs')
const mongoose = require('mongoose')
const File = mongoose.models['File']

const saveFile = async (req) => {
  // check if req file
  var file = fs.readFileSync(req.file.path)

  var encodedFile = file.toString('base64')
  const buf = Buffer.from(encodedFile, 'base64')

  File.create({
    contentType: req.file.mimetype,
    path: req.file.path,
    file: buf
  }, function (err, _file) {
    if (err) {
      return {}
    }
    return _file
    // saved!
  })
}

const saveFiles = async (req) => {
  if (req.files) {
    await req.files.forEach(element => {
      var file = fs.readFileSync(element.file.path)

      var encodedFile = file.toString('base64')
      const buf = Buffer.from(encodedFile, 'base64')

      File.create({
        contentType: element.file.mimetype,
        path: element.file.path,
        file: buf
      }, function (err, _file) {
        if (err) {
          return {}
        }
        return _file
        // saved!
      })
    })
  }
}

module.exports = {
  saveFiles: saveFiles,
  saveFile: saveFile
}
