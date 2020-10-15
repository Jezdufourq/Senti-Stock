// middleware import
var express = require('express')
var router = express.Router()
const asyncHandler = require('express-async-handler')
const { TweetDAO } = require('../models/tweetsDAO')
const { Tweet } = require('../controllers/tweetsUtil')

async function getTweets (req, res) {
  const { ticker } = req.params
  return await TweetDAO.getTweets({ ticker: ticker }).catch((error) => {
    console.log(error)
  })
}

router.get('/tweet/:ticker', asyncHandler(async function (req, res, next) {
  getTweets()
}))

router.post('/tweet', asyncHandler(async function (req, res, next) {
  const { ticker, settings } = req.body
  console.log(ticker)
  console.log(settings)
  const params = {
    q: ticker,
    lang: settings.lang,
    result_type: settings.result_type,
    count: settings.count
  }
  const response = await Tweet.fetchTweets(params).catch((error) => { console.log(error) })
  console.log(response)
  res.send(JSON.stringify(response))
}))

module.exports = router
