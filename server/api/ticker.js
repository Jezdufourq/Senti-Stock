var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const { tickersDAO } = require('../models/tickersDAO')
const { Cache } = require('../controllers/cache')

/**
 * Get current stored tickers for tweets
 */

/**
  * Store the current tickers for tweets
  */
router.post('/current-ticker', asyncHandler(async function (req, res, next) {
  const { ticker, exchange } = req.body
  console.log(ticker)
  console.log(exchange)
  // persist into the database
  await tickersDAO.createTicker({ ticker: ticker, exchange: exchange })
  const currentTickers = await tickersDAO.getTickers()
  console.log(currentTickers)
  // store the database entries into the cache
  Cache.createTickerCache({ data: currentTickers })
  res.sendStatus(200)
}))

module.exports = router
