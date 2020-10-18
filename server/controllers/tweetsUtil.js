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

module.exports = {
  /**
   * Fetches the tweets for a given ticker, gets the sentiment, and then persists into the database
   */
  createTweetsAnalysis: async function (req, res) {
    const { q, lang, result_type, count } = req
    const returnArr = []
    const twitParams = {
      q: q,
      lang: lang,
      result_type: result_type,
      count: count
    }
    // search for the tweets
    const twitterSearchResults = await client.get('search/tweets', twitParams)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
      })

    for (const tweet of twitterSearchResults.data.statuses) {
      // token and stem the tweets
      const tokenAndStemResult = Parser.tokenAndStemTweets({ text: tweet.text })
      // perform some sentiment analysis
      const sentimentResult = Analysis.getSentiment({ text: tokenAndStemResult })
      returnArr.push({
        created_date: tweet.created_at,
        id: tweet.id,
        text: tweet.text,
        sentiment: sentimentResult
      })
      // if the primary key is already in database, then skip
      const currentTweet = await TweetDAO.getTweetOnId({ tweet_id: tweet.id }).catch((error) => { console.log(error) })
      if (currentTweet != null) {
        continue
      } else {
      // Persist the data into the database
        await TweetDAO.createTweet({ tweet: tweet.text, tweet_id: tweet.id, ticker: q, tweet_date: tweet.created_at, sentiment: sentimentResult }).catch((error) => { console.log(error) })
      }
    }
    return returnArr
  },

  /**
   * Get tweets function
   * This retrieve the tweets from the database which have the certain ticker associated to them
   */
  getTweets: async function (req, res) {
    return await TweetDAO.getTweets({ ticker: req.ticker }).catch((error) => {
      console.log(error)
    })
  },

  /**
   * Returns the tweets between a certain date range
   */
  getTweetsBetweenDates: async function (req, res) {
    return await TweetDAO.getTweetsBetweenDates({ end_date: req.start_date, start_date: req.end_date, ticker: req.ticker }).catch((error) => {
      console.log(error)
    })
  }
}
