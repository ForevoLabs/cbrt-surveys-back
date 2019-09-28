const fs = require('fs')
const { DB_PATH } = require('./config')

module.exports = function (req, res) {
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
}
