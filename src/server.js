const express = require('express')
const app = express()

const mock = require('./api.mock')

const PORT = 3001

app.get('/api', function (req, res) {
  res.json(mock)
})

app.listen(PORT, function () {
  console.log(`API server is listening on port ${PORT}!`)
})
