// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()

// util import
var tradingViewUtil = require('../controllers/tradingviewUtil')
const { Tweet } = require('../controllers/twitterUtil')
const { Analysis } = require('../controllers/analysisUtil')

/**
 *
 * @swagger
 * /api/analysis:
 *  get:
 *   description: Retrieves the analysis based on a certain stock ticker
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
  '/analysis/:ticker',
  asyncHandler(async function (req, res, next) {
    const { ticker } = req.params
    // sanitize/lookup stock ticker
    var tradingViewResp = await tradingViewUtil
      .searchStockTickers(ticker)
      .catch((error) => {
        console.log(error)
      })
    if (tradingViewResp.length === 0) {
      const err = new Error('You have entered an invalid stock ticker.')
      err.status = 400
      next(err)
    }
    const tweetResponse = await Tweet.getTweets({ ticker: ticker }).catch((error) => { console.log(error) })
    const data = Tweet.cleanTweetData({ data: tweetResponse })
    const analysis = Analysis.getTickerSentiment({ ticker: ticker, data: data }).catch((error) => { console.log(error) })
    console.log(analysis)
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(analysis), 'utf-8')
  })
)

module.exports = router
