const moment = require('moment')
const uuidV4 = require('uuid/v4')
const { pool } = require('../config/dbConfig')

const tickersDAO = {
  /**
   * Retrieve all tweets based on stock ticker
   */
  async getTickers (req, res) {
    const queryText = 'SELECT * FROM tickers'
    try {
      const { rows } = await pool.query(queryText)
      if (!rows[0]) {
        res.status(400).send({ message: 'There are currently no entries in the database for the current tickers' })
      }
      return rows
    } catch (error) {
      res.status(500).send('Error')
    }
  },

  /**
   * Putting a ticker within the tickers table
   * This is to store the current tickers which are being searched
   */
  async createTicker (req, res) {
    const createQuery = `INSERT INTO
    tickers(ticker_id, created_date, modified_date, ticker, exchange)
    VALUES($1, $2, $3, $4, $5)
    returning *`
    try {
      const insertedValues = [
        uuidV4(),
        moment(new Date()),
        moment(new Date()),
        req.ticker,
        req.exchange
      ]
      const { rows } = await pool.query(createQuery, insertedValues)
      return JSON.stringify(rows)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  tickersDAO
}
