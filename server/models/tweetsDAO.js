const moment = require('moment')
const pool = require('../config/dbConfig')

const TweetDAO = {
  /**
     * Create a tweet entry
     */
  async createTweet (req, res) {
    const createQuery = `INSERT INTO
    tweets(tweet_id, created_date, modified_date, tweet, ticker, tweet_date, sentiment)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    returning *`

    const insertedValues = [
      req.tweet_id,
      moment(new Date()),
      moment(new Date()),
      req.tweet,
      req.ticker,
      req.tweet_date,
      req.sentiment
    ]

    const { rows } = await pool.query(createQuery, insertedValues).catch((error) => {
      console.log(error)
    })
    return rows
  },

  /**
   * retrieve an entry in the tweets table based on id
   */
  async getTweetOnId (req, res) {
    const queryText = 'SELECT * FROM tweets WHERE tweet_id = $1'
    try {
      const { rows } = await pool.query(queryText, [req.tweet_id])
      if (!rows[0]) {
        return res.status(400).send({ message: `There are currently no entries in the database for ticker ${req.tweet_id}` })
      }
      return rows
    } catch (error) {
      return res.status(500).send('Error')
    }
  },

  /**
   * Retrieve all tweets based on stock ticker
   */
  async getTweets (req, res) {
    const queryText = 'SELECT * FROM tweets WHERE ticker = $1'
    try {
      const { rows } = await pool.query(queryText, [req.ticker])
      if (!rows[0]) {
        return res.status(400).send({ message: `There are currently no entries in the database for ticker ${req.ticker}` })
      }
      return rows
    } catch (error) {
      return res.status(500).send('Error')
    }
  },

  /**
   * Retrieve a selection of tweet entries between a start and end date
   */
  async getTweetsBetweenDates (req, res) {
    const queryText = 'SELECT * FROM tweets WHERE tweet_date BETWEEN $1 AND $2 AND ticker=$3'
    const insertedValues = [req.start_date, req.end_date, req.ticker]
    const { rows } = await pool.query(queryText, insertedValues).catch((error) => {
      console.log(error)
    })
    if (rows.length === 0) {
      return new Error({ status: 400, message: `There are no entries in the database with ticker ${req.ticker}` })
    //   return res.status(400)
    }
    return rows
  }

}
module.exports = {
  TweetDAO
}
