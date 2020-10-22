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
      // update cache
      Cache.createCurrentTickers({ data: result })
      return res.status(200).json({ tickers: result })
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
  console.log(currentTickers)
  // store the database entries into the cache
  Cache.createCurrentTickers({ data: currentTickers })
  res.status(200).send({ tickers: currentTickers })
}))

/**
 * delete a ticker from the database, update the cache
 */
router.delete('/delete-ticker/:tickerId', asyncHandler(async function (req, res, next) {
  const { tickerId } = req.params
  console.log(tickerId)
  // deleting ticker
  await Ticker.deleteTicker({ tickerId: tickerId })
  // getting the current tickers
  const currentTickers = await Ticker.getCurrentTickers()
  // store the database entries into the cache
  Cache.createCurrentTickers({ data: currentTickers })

  res.status(200).send(currentTickers)
}))

module.exports = router
