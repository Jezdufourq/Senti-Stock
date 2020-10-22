var express = require('express')
var app = express()

const redis = require('redis')
const session = require('express-session')

const RedisStore = require('connect-redis')(session)

const isProduction = process.env.NODE_ENV === 'production'
console.log(isProduction ? process.env.REDIS_PORT_PROD : 6379)
console.log(isProduction ? process.env.REDIS_HOST_PROD : 'localhost')

const redisClient = redis.createClient({
  port: isProduction ? process.env.REDIS_PORT_PROD : 6379,
  host: isProduction ? process.env.REDIS_HOST_PROD : 'localhost'
})

app.use(
  session({
    store: new RedisStore({ client: redisClient })
  })
)

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('The redis session has disconnected'))
  }
  next()
})

module.exports = {
  redisClient
}
