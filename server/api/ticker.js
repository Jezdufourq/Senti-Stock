var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const redisClient = require('../config/cacheConfig')

// util import
const Cache = require('../controllers/cache')
const Ticker = require('../controllers/tickerUtil')

/**
 *
 * @swagger
 * /api/ticker/current-tickers:
 *  get:
 *   description: Retrieves the current tickers from the database
 *   produces:
 *    - application/json
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *    '500':
 *     description: 'Internal server error'
 *
*/
router.get('/current-tickers', asyncHandler(async function (req, res, next) {
  // check in the cache
  // if not there, check in the database
  const tickerKey = 'current-tickers'
  return redisClient.get(tickerKey, async function (error, result) {
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
 *
 * @swagger
 * /api/ticker/current-ticker:
 *  post:
 *   description: Puts the ticker into the database, and returns the current tickers in the database
 *   produces:
 *    - application/json
 *   parameters:
 *      in: body
 *      name: ticker
 *      description: The ticker which you want to put in the database
 *      type: string
 *      required: true
 *      in: body
 *      name: exchange
 *      description: The exchange of the ticker
 *      type: string
 *      required: false
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *    '500':
 *     description: 'Internal server error'
 *
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
 *
 * @swagger
 * /api/ticker/delete-ticker:
 *  delete:
 *   description: Deletes the ticker from the database
 *   produces:
 *    - application/json
 *   parameters:
 *      in: query
 *      name: tickerId
 *      description: The ticker which you want to put in the database
 *      type: string
 *      required: true
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *    '500':
 *     description: 'Internal server error'
 *
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
