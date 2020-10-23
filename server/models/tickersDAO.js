const moment = require('moment')
const uuidV4 = require('uuid/v4')
const pool = require('../config/dbConfig')

const tickersDAO = {
  /**
   * Retrieve all tweets based on stock ticker
   */
  async getTickers (req, res) {
    const queryText = 'SELECT * FROM tickers;'
    try {
      const { rows } = await pool.query(queryText)
      return rows
    } catch (error) {
      return error
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
    returning *;`
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
  },

  /**
   * Deletes a ticker from the database using the id of the ticker
   */
  async deleteTicker (req, res) {
    const createQuery = 'DELETE FROM tickers WHERE ticker_id = $1'
    try {
      await pool.query(createQuery, [req.tickerId])
    } catch (error) {
      console.log(error)
      return res.status(500).send(`There was an error deleting the ticker with id ${req.tickerId}`)
    }
  }
}

module.exports = {
  tickersDAO
}
