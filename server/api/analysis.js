// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
var parallelDotsUtil = require('../util/parallelDotsUtil')
var twitterUtil = require('../util/twitterUtil')
var tradingViewUtil = require('../util/tradingviewUtil')

// default query params
var params = {
  q: null,
  lang: 'en',
  result_type: 'recent',
  count: 10
}

/**
 *
 * @swagger
 * /api/analysis:
 *  get:
 *   description: Retrieves the analysis using tweets which are fed into the ParallelDots sentiment API.
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
router.get(
  '/analysis',
  asyncHandler(async function (req, res, next) {
    // query sanitization
    if (!req.query) {
      const err = new Error(
        'Required query params missing. You must enter a stock ticker.'
      )
      err.status = 400
      next(err)
    }
    if (!req.query.ticker) {
      const err = new Error(
        'Required query params missing. You must enter a stock ticker.'
      )
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
    params.lang = req.query.lang

    // sanitize/lookup stock ticker
    var tradingViewResp = await tradingViewUtil
      .searchStockTickers(req.query.ticker)
      .catch((error) => {
        console.log(error)
      })
    if (tradingViewResp.length == 0) {
      const err = new Error('You have entered an invalid stock ticker.')
      err.status = 400
      next(err)
    }

    // send the data to the twitter API
    var twitterResp = await twitterUtil.getTweetsText(params).catch((error) => {
      console.log(error)
    })
    var sentimentResp = await parallelDotsUtil
      .getParallelDotsSentiment(twitterResp)
      .catch((error) => {
        console.log(error)
      })

    // sending response back
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(sentimentResp, 'utf-8')
  })
)

module.exports = router
