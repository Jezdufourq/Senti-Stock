// importing middleware
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
var tradingViewUtil = require('../controllers/tradingviewUtil')

/**
 *
 * @swagger
 * /api/ticker/search-ticker:
 *  get:
 *   description: Retrieves the stock ticker using the TradingView ticker search API
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: ticker
 *      in: query
 *      description: Stock ticker to retrieve the analysis on
 *      type: string
 *      required: true
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *
*/
router.get('/search-ticker', asyncHandler(async function (req, res, next) {
  var stockTicker = req.query.ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(stockTicker).catch((error) => { console.log(error) })
  res.send(tradingViewResp)
}))

/**
 *
 * @swagger
 * /api/ticker/search-top-tickers:
 *  get:
 *   description: Retrieves the current top tickers from the TradingView ticker search API
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: ticker
 *      in: query
 *      description: Stock ticker to retrieve the analysis on
 *      type: string
 *      required: true
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *
*/
router.get('/search-top-tickers', asyncHandler(async function (req, res, next) {
  var tradingViewResp = await tradingViewUtil.searchTopStockTickers().catch((error) => { console.log(error) })
  res.send(tradingViewResp)
}))

module.exports = router
