
const redisClient = require('../config/cacheConfig')
// const client = redis.createClient('redis://n9960651-cache-001.km2jzi.0001.apse2.cache.amazonaws.com', {
//   no_ready_check: true,
//   retry_strategy: function (options) {
//     if (options.error && options.error.code === 'ECONNREFUSED') {
//     // End reconnecting on a specific error and flush all commands with
//     // a individual error
//       return new Error('The server refused the connection')
//     }
//     if (options.total_retry_time > 1000 * 60 * 60) {
//     // End reconnecting after a specific timeout and flush all commands
//     // with a individual error
//       return new Error('Retry time exhausted')
//     }
//     if (options.attempt > 10) {
//     // End reconnecting with built in error
//       return undefined
//     }
//     // reconnect after
//     return Math.min(options.attempt * 100, 3000)
//   }
// })

module.exports = {
  /**
   * Method to create the cache for the current tickers
   */
  createCurrentTickers: function (req, res) {
    const tickerKey = 'current-tickers'
    const tickers = req.data
    return redisClient.setex(tickerKey, 3600, JSON.stringify({
      tickers
    }), function (error, result) {
      if (error) {
        console.log(error)
        return result
      }
      return result
    })
  },
  getCurrentTickers: function (req, res) {
    const tickerKey = 'current-tickers'
    redisClient.get(tickerKey, function (error, result) {
      if (error) {
        console.log(error)
        return error
      }
      console.log(JSON.stringify(result))
      const resultJSON = JSON.parse(result)
      return res.status(200).json(resultJSON)
    })
  },
  createTweets: function (req) {
    const ticker = req.ticker
    const tweets = req.data
    redisClient.setex(ticker, 3600, JSON.stringify({
      query: ticker,
      tweets
    }), function (error, result) {
      if (error) {
        console.log(error)
      }
      return result
    })
  },

  updateCacheWithDatabase: function (req, res) {
  },

  deleteCache: function (req, res) {
    redisClient.flushdb(function (err, succeeded) {
      if (err) {
        console.log(err)
        return res.status(500).send('The cache failed to flush')
      }
      console.log(succeeded)
    })
  }
}
