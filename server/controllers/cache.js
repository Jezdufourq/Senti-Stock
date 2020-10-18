const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient()
// client.on('error', (err) => {
//   console.log('Error ' + err)
// })

module.exports = {
  /**
   * Method to create the cache for the current tickers
   */
  createCurrentTickers: function (req, res) {
    const tickerKey = 'current-tickers'
    const data = req.data
    return client.setex(tickerKey, 3600, JSON.stringify({
      source: 'Postgres Current Tickers Cache',
      data
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
    client.get(tickerKey, function (error, result) {
      if (error) {
        console.log(error)
        return error
      }
      console.log(JSON.stringify(result))
      const resultJSON = JSON.parse(result)
      return res.status(200).json(resultJSON)
    })
  },
  createTweetCache: function (req) {
    const { tweetId } = req.params
    const { tweetData } = req.params
    client.setex(tweetId, 3600, tweetData, function (error, result) {
      if (error) {
        console.log(error)
      }
      return result
    })
  }

}
