// import middleware
var Twit = require('twit')
const { TweetDAO } = require('../models/tweetsDAO')

// defining twitter middleware params
var client = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

const Tweet = {
  /**
   * Stream tweet data
   */
  streamTweets (req, res) {
    var stream = client.stream('statuses/filter', { track: req.ticker, lang: 'en' })

    stream.on('tweet', function (tweet) {
      console.log(tweet)
      res.write(tweet)
    })
    stream.on('error', function (error) {
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

  async getTweets (req, res) {
    return await TweetDAO.getTweets({ ticker: req.ticker }).catch((error) => {
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
