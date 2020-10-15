// import middleware
var Twit = require('twit')
const { TweetDAO } = require('../models/tweetsDAO')
const { Parser } = require('../controllers/parserUtil')
const { Analysis } = require('../controllers/analysisUtil')
// defining twitter middleware params
var client = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

const Tweet = {
  /**
   * fetch tweets
   */
  async fetchTweets (req, res) {
    const { q, lang, result_type, count } = req
    const returnArr = []
    const twitParams = {
      q: q,
      lang: lang,
      result_type: result_type,
      count: count
    }
    const twitterSearchResults = await client.get('search/tweets', twitParams)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
      })

    for (const tweet of twitterSearchResults.data.statuses) {
      // const tokenResult = Parser.tokenTweets({ text: tweet.text })
      // console.log(tokenResult)
      const tokenAndStemResult = Parser.tokenAndStemTweets({ text: tweet.text })
      // console.log(tokenAndStemResult)
      const sentimentResult = Analysis.getSentiment({ text: tokenAndStemResult })
      // console.log(Analysis.getSentiment({ text: tokenAndStemResult }))
      // parse the tweets
      returnArr.push({
        created_date: tweet.created_at,
        id: tweet.id,
        text: tweet.text,
        sentiment: sentimentResult
      })

      // TODO: Regis store
      // if tweet is is currently in database
      // store it in the redis store
      // return from regis store
      // if tweet is in database and regis store
      // get from regis store

      const persistedData = await TweetDAO.createTweet({ tweet: tweet.text, tweet_id: tweet.id, ticker: q, tweet_date: tweet.created_at, sentiment: sentimentResult }).catch((error) => { console.log(error) })
      console.log(persistedData)
    }
    return returnArr
  },

  async createTweet (req, res) {
    console.log(req.body)
    const { q, lang, resultType, count } = req.body
    const twitParams = {
      q: q,
      lang: lang,
      result_type: resultType,
      count: count
    }
    console.log(twitParams)
    const twitterSearchResults = await client.get('search/tweets', twitParams)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
      })

    for (const tweet of twitterSearchResults.statuses) {
      // persist the tweets into the SQL database first
      const resp = await TweetDAO.createTweet({ tweet_id: tweet.id, tweet_date: tweet.created_at, tweet: tweet.text, ticker: req.q }).catch((err) => { console.log(err) })
      // if the tweets are already in the SQL database, then retrieve them from the cache
      console.log(resp)
    }
  },

  async getTweets (req, res) {
    const { ticker } = req.params
    return await TweetDAO.getTweets({ ticker: ticker }).catch((error) => {
      console.log(error)
    })
  },

  /**
   * Get tweet data
   * This should accept a date range
   */
  async getTweetsBetweenDates (req, res) {
    return await TweetDAO.getTweetsBetweenDates({ end_date: req.start_date, start_date: req.end_date, ticker: req.ticker }).catch((error) => {
      console.log(error)
    })
    // if the tweets are in the database, store in the redis cache
  },

  /**
   * clean tweet data
   */
  cleanTweetData (req, res) {
    const tweetArr = []
    req.data.forEach((element) => {
      tweetArr.push(element.tweet)
    })
    return tweetArr
  }
}
module.exports = {
  Tweet
}
