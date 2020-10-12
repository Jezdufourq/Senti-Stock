// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
var twitterUtil = require('../util/twitterUtil')
var tradingViewUtil = require('../util/tradingviewUtil')

var params = {
  q: null,
  lang: 'en',
  result_type: 'recent',
  count: 10
}

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
router.get('/tweets', asyncHandler(async function (req, res, next) {
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

  // ticker query sanitization
  // sanitize/lookup stock ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(req.query.ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length == 0) {
    const err = new Error('You have entered an invalid stock ticker.')
    err.status = 400
    next(err)
  }

  // settings params
  params.q = req.query.ticker
  params.count = req.query.count
  params.result_type = req.query.type
  params.lang = 'en'

  // send the data to the twitter API
  var twitterResp = await twitterUtil.getTweetsText(params).catch((error) => { console.log(error) })

  // sending response back
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(twitterResp), 'utf-8')
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
  var twitterResp = await twitterUtil.getTweetsDetailed(params).catch((error) => { console.log(error) })

  // sending response back
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(twitterResp), 'utf-8')
}))

/**
 * @swagger
 * /api/tweets
 *  post:
 *   description: retrieves a tweet feed from the Twitter search API, and persists the tweets into the database
 *   produces:
 *    - application/json
 *   parameters:
      - in: body
        name: tweetParams
        description: The parameters required to create the tweets based on the stock ticker
        schema:
          type: object
          required:
            - ticker
            - count
            - type
            - lang
          properties:
            ticker:
              type: string
            count:
              type: integer
            type:
              type: string
            lang:
              type: string
 */
router.get('/tweets', (req, res) => {
  const { ticker, count, type, lang } = req.body
})

module.exports = router
