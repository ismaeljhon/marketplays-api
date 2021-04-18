const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const context = require('./utils/context')
const schema = require('./modules')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const File = mongoose.models['File']
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const server = new ApolloServer({
  schema: schema,

  context: async ({ req }) => ({
    user: await context.getUser(req)
  }),
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
})

const app = express()

app.use(express.urlencoded())
app.use(express.json())

// add file upload handler;
app.post('/uploadFile', upload.single('file'), (req, res, next) => {
  const reqFile = req.file

  if (!reqFile) {
    const error = new Error('Please upload file')
    error.httpStatusCode = 400
    return next(error)
  }

  const file = fs.readFileSync(reqFile.path)
  const encodedFile = file.toString('base64')
  const buf = Buffer.from(encodedFile, 'base64')

  File.create({
    contentType: req.file.mimetype,
    path: req.file.path,
    file: buf
  }, function (err, _file) {
    if (err) {
      return next(err)
    }
  })
  res.send({
    success: true,
    file: file,
    message: 'Uploaded successfully'
  })
})

// add files upload handler;
app.post('/uploadFiles', upload.array('files', 100), (req, res, next) => {
  const files = req.files

  if (!files) {
    const error = new Error('Please upload file')
    error.httpStatusCode = 400
    return next(error)
  }
  req.files.forEach(element => {
    var file = fs.readFileSync(element.file.path)
    var encodedFile = file.toString('base64')
    const buf = Buffer.from(encodedFile, 'base64')

    File.create({
      contentType: req.file.mimetype,
      path: req.file.path,
      file: buf
    }, function (err, _file) {
      if (err) {
        return next(err)
      }
    })
  })

  res.send({
    success: true,
    files: files,
    message: 'Uploaded successfully'
  })
})

server.applyMiddleware({
  path: '/',
  app
})

module.exports = app
