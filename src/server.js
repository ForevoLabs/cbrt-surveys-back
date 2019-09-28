const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

const FileStore = require('session-file-store')(session)
const app = express()

const { ADMIN, PORT, SESSIONS_PATH } = require('./config')
const handleGet = require('./reading')
const handlePost = require('./writing')

const fileStoreOptions = {
  path: SESSIONS_PATH,
}

app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'secret secret',
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

function authenticationMiddleware (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err)
    }
    if (!user) {
      console.log('Wrong credentials')
      return res.status(401).json({ error: 'Not authorized' })
    }
    req.logIn(user, function (err) {
      console.log('Admin IP:', req.ip)
      if (err) {
        console.error('Inner error')
        res.status(401).json({ error: 'Not authorized', description: err })
        return
      }
      next()
    })
  })(req, res, next)
}

passport.use(new LocalStrategy(
  function (username, password, done) {
    if (username === ADMIN.name && password === ADMIN.password) {
      return done(null, ADMIN)
    }
    return done(null, false, { message: 'Incorrect credentials' })
  },
))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  if (id === ADMIN.id) {
    return done(null, ADMIN.id)
  }
  done('No such user ID!')
})

app.get('/api', handleGet)

app.post('/api/login', authenticationMiddleware, function (req, res) {
  res.json({ status: 'success', user: req.user.name })
})

app.get('/api/logout', function (req, res) {
  req.logout()
  res.json({ status: 'success', description: 'Logged out' })
})

app.post('/api', function (req, res, next) {
  if(req.user !== ADMIN.id) {
    console.log('Not authorized from', req.ip)
    res.status(403).json({ error: 'Please authorize' })
    return
  }
  console.log('Update DB')
  next()
}, handlePost)

app.listen(PORT, function () {
  console.log(`API server is listening on port ${PORT}!`)
})
