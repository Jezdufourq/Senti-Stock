const moment = require('moment')
const uuidV4 = require('uuid/v4')
const pool = require('../config/dbConfig')

const analysisDAO = {
  /**
   * Retrieve all tweets based on stock ticker
   */
  async getAnalysis (req, res) {
    const queryText = 'SELECT * FROM analysis;'
    try {
      const { rows } = await pool.query(queryText)
      return rows
    } catch (error) {
      return error
    }
  },

  /**
   * Retrieve analysis based on the ticker
   */
  async getAnalysisOnTicker (req, res) {
    const queryText = 'SELECT * FROM analysis WHERE ticker = $1'
    try {
      const insertedValues = [
        req.ticker
      ]
      const { rows } = await pool.query(queryText, insertedValues)
      return JSON.stringify(rows)
    } catch (error) {
      console.log(error)
      return error
    }
  },
  /**
   * Create analysis
   */
  async createAnalysis (req, res) {
    try {
      const createQuery = `INSERT INTO
    analysis(analysis_id, created_date, modified_date, average_sentiment, ticker)
    VALUES($1, $2, $3, $4, $5)
    returning *`
      const insertedValues = [
        uuidV4(),
        moment(new Date()),
        moment(new Date()),
        req.average_sentiment,
        req.ticker
      ]

      const { rows } = await pool.query(createQuery, insertedValues)
      return rows
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * Deletes the analysis from the database on the ticker id
   */
  async deleteAnalysisOnTicker (req, res) {
    const createQuery = 'DELETE FROM analysis WHERE ticker = $1'
    try {
      await pool.query(createQuery, [req.ticker])
    } catch (error) {
      console.log(error)
      return res.status(500).send(`There was an error deleting the analysis with id ${req.ticker}`)
    }
  }
}

module.exports = {
  analysisDAO
}
