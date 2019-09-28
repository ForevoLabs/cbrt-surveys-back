const express = require('express')
const app = express()

const fs = require('fs')

const mock = require('./api.mock')

const PORT = 3001
const DB_PATH = 'db/surveys.db.json'

function proceedNoDB (res, e) {
  console.error('Reading file error:', e)
  res.json(mock)
}

app.use(express.json())

app.get('/api', function (req, res, next) {
  try {
    if (!fs.existsSync(DB_PATH)) {
      proceedNoDB(res, 'No DB file!')
      return
    }
    const data = fs.readFileSync(DB_PATH)
    res.json(JSON.parse(data))
  } catch (e) {
    proceedNoDB(res, e)
  }
})

app.post('/api', function (req, res) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(req.body, null, 2))
    res.json({ status: 'success' })
  } catch (e) {
    if (e) {
      console.error('Writing file error:', e)
      res
        .status(500)
        .json({ status: 'error', description: e })
    }
  }
})

app.listen(PORT, function () {
  console.log(`API server is listening on port ${PORT}!`)
})
