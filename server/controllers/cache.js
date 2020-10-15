const redis = require('redis')
const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient(REDIS_PORT)

/**
 * Caching class using redis
 */
const Cache = {
  /**
     * Method to handle caching the tweets
     */
  setTweetCache (req, res, next) {
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
   * Method to handle getting the cached tweets
   */
  getTweetCache (req, res, next) {
    const { tweetId } = req.params

    client.get(tweetId, (error, data) => {
      if (error) throw error

      if (data != null) {
        return data
      } else {
        next()
      }
    })
  }
}

module.exports = {
  Cache
}
