const fs = require('fs')
const { DB_PATH } = require('./config')
const mock = require('./api.mock')

function proceedNoDB (res, e) {
  console.error('Reading file error:', e)
  res.json(mock)
}

module.exports = function (req, res) {
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
}
