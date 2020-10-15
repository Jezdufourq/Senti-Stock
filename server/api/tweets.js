// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
const { Tweet } = require('../controllers/tweetsUtil')
const { Cache } = require('../controllers/cache')
const tradingViewUtil = require('../controllers/tradingviewUtil')

var params = {
  q: null,
  lang: 'en',
  result_type: 'recent',
  count: 10
}

// router.post('tweet/:ticker', Cache.getTweetCache())
// router.get('tweet/:ticker', Tweet.getTweets())

router.get('/tweet-stream/:ticker', asyncHandler(async function (req, res, next) {
  const { ticker } = req.params
  const results = Tweet.streamTweets({ ticker: ticker })
  res.write(results)
}))

/**
 *
 * @swagger
 * /api/tweets:
 *  get:
 *   description: Retrieves a short version of the tweets relating to the current stock ticker using the Twitter API
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: ticker
 *      in: query
 *      description: Stock ticker to retrieve the analysis on
 *      type: string
 *      required: true
 *    - name: count
 *      in: query
 *      description: Count for the number of tweets to retrieve
 *      type: integer
 *      required: false
 *    - name: type
 *      in: query
 *      description: Type of tweet to retrieve (recent or popular)
 *      type: string
 *      required: false
 *    - name: lang
 *      in: query
 *      description: Type of language to retrieve the tweet in
 *      type: string
 *      required: false
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *
*/
router.get('/tweets/:ticker', asyncHandler(async function (req, res, next) {
  const { ticker } = req.params
  // ticker query sanitization
  // sanitize/lookup stock ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length === 0) {
    const err = new Error('You have entered an invalid stock ticker.')
    err.status = 400
    next(err)
  }

  const results = await Tweet.getTweets({ ticker: ticker }).catch((error) => { console.log(error) })

  // sending response back
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(results), 'utf-8')
}))

router.get('/tweets/between-dates', asyncHandler(async function (req, res, next) {
  // start_date
  // end_date
  // ticker
  if (!req.query.ticker) {
    const err = new Error('Required query params missing. You must enter a stock ticker.')
    err.status = 400
    next(err)
  }
  // ticker query sanitization
  // sanitize/lookup stock ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(req.query.ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length === 0) {
    const err = new Error('You have entered an invalid stock ticker.')
    err.status = 400
    next(err)
  }

  const tweetsBetweenDates = await Tweet.getTweetsBetweenDates({ end_date: req.query.end_date, start_date: req.query.start_date, ticker: req.query.ticker }).catch((error) => {
    console.log(error)
    next(error)
  })
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(tweetsBetweenDates), 'utf-8')
}))

/**
 *
 * @swagger
 * /api/tweets-detailed:
 *  get:
 *   description: Retrieves a detailed version of the tweets relating to the current stock ticker using the Twitter API
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: ticker
 *      in: query
 *      description: Stock ticker to retrieve the analysis on
 *      type: string
 *      required: true
 *    - name: count
 *      in: query
 *      description: Count for the number of tweets to retrieve
 *      type: integer
 *      required: false
 *    - name: type
 *      in: query
 *      description: Type of tweet to retrieve (recent or popular)
 *      type: string
 *      required: false
 *    - name: lang
 *      in: query
 *      description: Type of language to retrieve the tweet in
 *      type: string
 *      required: false
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *    '400':
 *     description: 'Required query params mission. You must enter a stock ticker'
 *
*/
router.get('/tweets-detailed', asyncHandler(async function (req, res, next) {
  // query sanitization
  if (!req.query) {
    const err = new Error('Required query params missing. You must enter a stock ticker.')
    err.status = 400
    next(err)
  }
  if (!req.query.ticker) {
    const err = new Error('Required query params missing. You must enter a stock ticker.')
    err.status = 400
    next(err)
  }
  if (!req.query.count) {
    params.count = 10 // setting default to 10
  }
  if (!req.query.type) {
    params.result_type = 'recent' // setting default to 10
  }
  if (!req.query.lang) {
    params.lang = 'en' // setting default to 10
  }

  // settings params
  params.q = req.query.ticker
  params.count = req.query.count
  params.result_type = req.query.type
  params.lang = 'en'

  // ticker query sanitization
  // sanitize/lookup stock ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(req.query.ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length === 0) {
    const err = new Error('You have entered an invalid stock ticker')
    err.status = 400
    next(err)
  }

  // send the data to the twitter API
  var twitterResp = await Tweet.getTweetsDetailed(params).catch((error) => { console.log(error) })

  // sending response back
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(twitterResp), 'utf-8')
}))

router.post('/tweets', asyncHandler(async function (req, res, next) {
  const { tickers, settings } = req.body
  console.log(tickers[0])
  const result = await Tweet.createTweet({ q: tickers[0], lang: settings.lang, count: settings.count, resultType: settings.result_type })
  console.log(tickers)
  console.log(settings)
  console.log(result)
  res.writeHead(200, { 'Content-Type': 'application/json' })
}))

module.exports = router
