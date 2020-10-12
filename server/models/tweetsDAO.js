const moment = require('moment')
const uuidv4 = require('uuid/v4')
const { pool } = require('../config/dbConfig')

const TweetDAO = {
  /**
     * Create a tweet entry
     */
  async createTweet (req, res) {
    const createQuery = `INSERT INTO
    tweets(tweet_id, created_date, modified_date, tweet, ticker, tweet_date)
    VALUES($1, $2, $3, $4, $5, $6)
    returning *`

    const insertedValues = [
      req.tweet_id,
      moment(new Date()),
      moment(new Date()),
      req.tweet,
      req.ticker,
      req.tweet_date
    ]
    console.log(createQuery)
    console.log(insertedValues)

    const { rows } = await pool.query(createQuery, insertedValues).catch((error) => {
      console.log(error)
    })
    console.log('rows' + JSON.stringify(rows))
  },

  /**
   * Retrieve a tweet entry based on stock ticker
   */
  async getTweet (req, res) {
    const queryText = 'SELECT * FROM tweets WHERE ticker = $1'
    try {
      const { rows } = await pool.query(queryText, [req.body.ticker])
      if (!rows[0]) {
        return res.status(400).send({ message: `There are currently no entries in the database for ticker ${req.body.ticker}` })
      }
      // creating jwt token
      return res.status(200).send({ rows })
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  /**
   * Retrieve a selection of tweet entries between a start and end date
   */
  async getTweetsBetweenDates (req, res) {
    const queryText = 'SELECT * FROM tweets WHERE created_date IS BETWEEN $1 AND $2 AND ticker=$3'
    try {
      const { rows } = await pool.query(queryText, [req.start_date, req.end_date, req.ticker])
      if (!rows[0]) {
        return res.status(400).send({ message: `There are currently no entries in the database for ticker ${req.body.ticker}` })
      }
      return res.status(200).send({ rows })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  /**
   * Delete a select of tweets based on a ticker
   */
//   async delete (req, res) {
//     const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *'
//     try {
//       const { rows } = await pool.query(deleteQuery, [req.user.id])
//       if (!rows[0]) {
//         return res.status(404).send({ message: 'user not found' })
//       }
//       return res.status(204).send({ message: 'deleted' })
//     } catch (error) {
//       return res.status(400).send(error)
//     }
//   }
}
module.exports = {
  TweetDAO
}
