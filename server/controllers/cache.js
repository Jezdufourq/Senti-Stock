// module.exports = {
//   /**
//    * Method to create the cache for the current tickers
//    */
//   createCurrentTickers: function (req, res) {
//     const tickerKey = 'current-tickers'
//     const tickers = req.data
//     return redisClient.setex(tickerKey, 3600, JSON.stringify({
//       tickers
//     }), function (error, result) {
//       if (error) {
//         console.log(error)
//         return result
//       }
//       return result
//     })
//   },
//   getCurrentTickers: function (req, res) {
//     const tickerKey = 'current-tickers'
//     redisClient.get(tickerKey, function (error, result) {
//       if (error) {
//         console.log(error)
//         return error
//       }
//       console.log(JSON.stringify(result))
//       const resultJSON = JSON.parse(result)
//       return res.status(200).json(resultJSON)
//     })
//   },
//   createTweets: function (req) {
//     const ticker = req.ticker
//     const tweets = req.data
//     redisClient.setex(ticker, 3600, JSON.stringify({
//       query: ticker,
//       tweets
//     }), function (error, result) {
//       if (error) {
//         console.log(error)
//       }
//       return result
//     })
//   },

//   updateCacheWithDatabase: function (req, res) {
//   },

//   deleteCache: function (req, res) {
//     redisClient.flushdb(function (err, succeeded) {
//       if (err) {
//         console.log(err)
//         return res.status(500).send('The cache failed to flush')
//       }
//       console.log(succeeded)
//     })
//   }
// }
