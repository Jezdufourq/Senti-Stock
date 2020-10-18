const redis = require('redis')
const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient(REDIS_PORT)

const Ticker = {
  createRedisStore (req, res) {
    const redisKey = 'current-tickers'
  }
}

module.exports = {
  Ticker
}
