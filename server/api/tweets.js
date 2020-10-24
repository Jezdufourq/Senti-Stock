// middleware import
var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const redisClient = require('../config/cacheConfig')

// util import
const Tweets = require('../controllers/tweetsUtil')
const Cache = require('../controllers/cache')
const tradingViewUtil = require('../controllers/tradingviewUtil')

/**
 * Gets the data for the current stock ticker (this includes the sentiment)
 * Returns the cache of the tweet, or the database entries
 */
router.get('/analysis/:ticker', asyncHandler(async function (req, res, next) {
  const { ticker } = req.params
  return redisClient.get(ticker, async function (error, result) {
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
      const tweetsResult = await Tweets.getTweets({ ticker: ticker })
      Cache.createTweets({ ticker: ticker, data: tweetsResult })
      res.status(200).send({ query: ticker, tweets: tweetsResult })
    }
  })
}))

/**
 * Gets all of the historical averages for the tweets
 */
router.get('/historical-analysis/:ticker', asyncHandler(async function (req, res, next) {
  // check in the cache
  // if not there, check in the database
  const historicalKey = 'historical-average:'
  const { ticker } = req.params
  return redisClient.get(historicalKey + ticker, async function (error, result) {
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
      const historicalAverage = await Tweets.getHistoricalAverageOnTicker({ ticker: ticker })
      // update cache
      Cache.createHistoricalAverage({ ticker: ticker, data: historicalAverage })
      return res.status(200).json({ query: ticker, average: historicalAverage })
    }
  })
}))

/**
 * Creating the historical average for the given tweet
 */
router.post('/historical-analysis', asyncHandler(async function (req, res, next) {
  const { ticker } = req.body
  await Tweets.createHistoricalAverage({ ticker: ticker, lang: 'en', count: 100, result_type: 'recent' })
  const historicalAverage = await Tweets.getHistoricalAverageOnTicker({ ticker: ticker })
  // Persisting into the redis cache
  Cache.createHistoricalAverage({ ticker: ticker, data: historicalAverage })
  res.status(200).send({ query: ticker, historicalAverage: historicalAverage })
}))

/**
 * Store the data for the tweets/sentiment analysis for a given stock ticker
 * response - all of the sentiment for the stock
 */
router.post('/analysis', asyncHandler(async function (req, res, next) {
  const { ticker } = req.body
  // checking to see if the ticker is a valid ticker
  var tradingViewResp = await tradingViewUtil.searchStockTickers(ticker).catch((error) => { console.log(error) })
  if (tradingViewResp.length === 0) {
    const err = new Error('You have entered an invalid stock ticker.')
    err.status = 400
    next(err)
  }
  // creating the analysis and persisting into the database
  await Tweets.createTweetsAnalysis({ ticker: ticker, lang: 'en', count: 100, result_type: 'recent' })
  // get all of the tweetsSentiment (including historical - using database)
  const tweetsSentiment = await Tweets.getTweets({ ticker: ticker })
  // persisting into the redis cache
  Cache.createTweets({ ticker: ticker, data: tweetsSentiment })
  res.status(200).send({ query: ticker, tweets: tweetsSentiment })
}))

module.exports = router
