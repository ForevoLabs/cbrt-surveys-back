const express = require('express')

const { PORT } = require('./config')
const handleGet = require('./reading')
const handlePost = require('./writing')

const app = express()

app.use(express.json())

app.get('/api', handleGet)

app.post('/api', handlePost)

app.listen(PORT, function () {
  console.log(`API server is listening on port ${PORT}!`)
})
