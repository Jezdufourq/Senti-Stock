// import middleware
var Twit = require('twit')
const { TweetDAO } = require('../models/tweetsDAO')
const { AnalysisDAO } = require('../models/analysisDAO')
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
    const { ticker, lang, result_type, count } = req
    const returnArr = []
    const twitParams = {
      q: ticker,
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
      // not adding sentiment which returns 0
      if (sentimentResult === 0) {
        continue
      }
      console.log(`sentimentResult: ${sentimentResult}`)
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
        await TweetDAO.createTweet({ tweet: tweet.text, tweet_id: tweet.id, ticker: ticker, tweet_date: tweet.created_at, sentiment: sentimentResult }).catch((error) => { console.log(error) })
      }
    }
    return returnArr
  },

  /**
   * This function creates the average sentiment for a ticker using the historical data
   */
  createHistoricalAverage: async function (req, res) {
    const { ticker, lang, result_type, count } = req
    var cumulativeSentiment = 0
    var average = 0
    const twitParams = {
      q: ticker,
      lang: lang,
      result_type: result_type,
      count: count
    }

    const currentTweets = await TweetDAO.getTweets({ ticker: ticker })
    if (currentTweets.length === 0) {
    // Currently no information in the database
    // So we are going to go out and fetch the first batch of tweets, and then do the analysis for each of the tweets
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
        // not adding sentiment which returns 0
        if (sentimentResult === 0) {
          continue
        }
        cumulativeSentiment += sentimentResult
        // if the primary key is already in database, then skip
        const currentTweet = await TweetDAO.getTweetOnId({ tweet_id: tweet.id }).catch((error) => { console.log(error) })
        if (currentTweet != null) {
          continue
        } else {
        // Persist the data into the database
          await TweetDAO.createTweet({ tweet: tweet.text, tweet_id: tweet.id, ticker: ticker, tweet_date: tweet.created_at, sentiment: sentimentResult }).catch((error) => { console.log(error) })
        }
      }
      average = cumulativeSentiment / twitterSearchResults.data.statuses.length
      await AnalysisDAO.createAnalysis({ ticker: ticker, average_sentiment: average })
    } else {
      // if the data is already in the database, go out and fetch most recent data, update the data in the database, and then perform
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
        // not adding sentiment which returns 0
        if (sentimentResult === 0) {
          continue
        }
        cumulativeSentiment += sentimentResult
        // if the primary key is already in database, then skip
        const currentTweet = await TweetDAO.getTweetOnId({ tweet_id: tweet.id }).catch((error) => { console.log(error) })
        if (currentTweet != null) {
          continue
        } else {
        // Persist the data into the database
          await TweetDAO.createTweet({ tweet: tweet.text, tweet_id: tweet.id, ticker: ticker, tweet_date: tweet.created_at, sentiment: sentimentResult }).catch((error) => { console.log(error) })
        }
      }
      // fetch the data
      const currentTweets = await TweetDAO.getTweets({ ticker: ticker })
      // calculate the average
      currentTweets.forEach((tweet) => {
        cumulativeSentiment += tweet.sentiment
      })
      console.log(`currentTweets: ${currentTweets}`)
      average = cumulativeSentiment / currentTweets.length
      console.log(`average: ${average}`)
      // persist into the database
      await AnalysisDAO.createAnalysis({ ticker: ticker, average_sentiment: average })
    }
    return currentTweets
  },

  /**
   * Get historical average for tweets based on ticker
   */
  getHistoricalAverageOnTicker: async function (req, res) {
    return await AnalysisDAO.getAnalysisOnTicker({ ticker: req.ticker }).catch((error) => {
      console.log(error)
    })
  },

  /**
   * Gets the whole historical average
   */
  getHistoricalAverage: async function (req, res) {
    return await AnalysisDAO.getAnalysis().catch((error) => {
      console.log(error)
    })
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
