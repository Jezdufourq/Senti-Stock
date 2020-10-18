var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const Ticker = require('../controllers/tickerUtil')
const Cache = require('../controllers/cache')
const redis = require('redis')
const client = redis.createClient()

/**
 * Get current stored tickers for tweets
 */
router.get('/current-tickers', asyncHandler(async function (req, res, next) {
  // check in the cache
  // if not there, check in the database
  const tickerKey = 'current-tickers'
  return client.get(tickerKey, async function (error, result) {
    if (error) {
      console.log(error)
      return res.status(500)
    }
    if (result) {
      console.log('cache')
      const resultJSON = JSON.parse(result)
      return res.status(200).json(resultJSON)
    } else {
      console.log('db')
      const result = await Ticker.getCurrentTickers()
      return res.status(200).json(result)
    }
  })
}))

/**
  * Store the current tickers for tweets
  */
router.post('/current-ticker', asyncHandler(async function (req, res, next) {
  const { ticker, exchange } = req.body
  // persist into the database
  await Ticker.createTicker({ ticker: ticker, exchange: exchange })
  const currentTickers = await Ticker.getCurrentTickers()
  // store the database entries into the cache
  Cache.createCurrentTickers({ data: currentTickers })
  res.status(200).send(currentTickers)
}))

module.exports = router
