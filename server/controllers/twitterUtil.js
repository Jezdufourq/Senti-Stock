// import middleware
var Twitter = require('twitter')
const { TweetDAO } = require('../models/tweetsDAO')

// defining twitter middleware params
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
})

const Tweet = {
/**
 * getTweetsText()
 * Gets the text for each of the tweets. Returns a promise.
 */
  async getTweetsText (req, res) {
    var returnArr = []
    return await client.get('search/tweets', req.body)
      .then((response) => {
        response.statuses.forEach((status) => {
          returnArr.push(status.text)
        })
        returnArr.join(' ')
        return returnArr
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * getTweetsDetailed()
   * Gets the detailed information for each of the tweets. Returns a promise.
   */
  async getTweetsDetailed (req, res) {
    return await client.get('search/tweets', req.body)
      .then((res) => {
        return res.statuses
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * Create tweet data
   */
  async createTweets (req, res) {
    const twitterSearchResults = await client.get('search/tweets', req)
      .then((response) => {
        // console.log(response)
        return response
      })
      .catch((error) => {
        console.log(error)
      })
    const tweets = twitterSearchResults.statuses
    for (const tweet of tweets) {
      // persist the tweets into the SQL database first
      const resp = await TweetDAO.createTweet({ tweet_id: tweet.id, tweet_date: tweet.created_at, tweet: tweet.text, ticker: req.q }).catch((err) => { console.log(err) })
      // if the tweets are already in the SQL database, then retrieve them from the cache
    }
    return { tweets: tweets, ticker: req.q }
  },

  /**
   * Get tweet data
   * This should accept a date range
   */
  async getTweets (req, res) {
    const { start_date, end_date, stock_ticker } = req

    // if the tweets are in the database, store in the redis cache
  }
}
module.exports = {
  Tweet
}
