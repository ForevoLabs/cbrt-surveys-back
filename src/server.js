const express = require('express')
const app = express()

const fs = require('fs')

const mock = require('./api.mock')

const PORT = 3001
const DB_PATH = 'db/surveys.db.json'

app.use(express.json())

app.get('/api', function (req, res) {
  res.json(mock)
})

app.post('/api', function (req, res) {
  try {
    fs.writeFile(
      DB_PATH,
      JSON.stringify(req.body, null, 2),
      (err) => {
        if (err) {
          console.error('err', err)
          res
            .status(500)
            .json({ status: 'error', description: err })
        }
        res.json({ status: 'success' })
      })
  } catch (e) {
    // NB It doesn't showed in console, wrap fs into Promise
  }
})

app.listen(PORT, function () {
  console.log(`API server is listening on port ${PORT}!`)
})
