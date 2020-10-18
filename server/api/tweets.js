// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
const Tweet = require('../controllers/tweetsUtil')
const { Cache } = require('../controllers/cache')
const tradingViewUtil = require('../controllers/tradingviewUtil')

router.get('/tweet/:ticker', asyncHandler(async function (req, res, next) {

}))

/**
 * Store the data for the tweets/sentiment analysis for a given stock ticker
 */
router.post('/tweet', asyncHandler(async function (req, res, next) {
  const { ticker, settings } = req.body
  var tradingViewResp = await tradingViewUtil.searchStockTickers(ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length === 0) {
    const err = new Error('You have entered an invalid stock ticker.')
    err.status = 400
    next(err)
  }
  console.log(ticker)
  const result = await Tweet.createTweet({ q: ticker, lang: settings.lang, count: settings.count, resultType: settings.result_type })
  console.log(ticker)
  console.log(settings)
  console.log(result)
  res.writeHead(200, { 'Content-Type': 'application/json' })
}))

module.exports = router
