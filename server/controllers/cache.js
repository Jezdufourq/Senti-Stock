const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient()
// client.on('error', (err) => {
//   console.log('Error ' + err)
// })
/**
 * Caching class using redis
 */
const Cache = {
  /**
     * Method to handle caching the tweets
     */
  createTweetCache (req, res, next) {
    try {
      const { tweetId } = req.params
      const { tweetData } = req.params
      client.setex(tweetId, 3600, tweetData)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  },

  /**
   * Method to create the cache for the current tickers
   */
  createTickerCache (req, res, next) {
    try {
      const tickerKey = 'current-tickers'
      const data = req.data
      console.log(req.data)
      client.setex(tickerKey, 3600, JSON.stringify({
        source: 'S3 Cache',
        data
      }))
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
}

module.exports = {
  Cache
}
