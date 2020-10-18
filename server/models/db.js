const { pool } = require('../config/dbConfig')

/**
 * Create tweets table
 */
const createTweetsTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
    tweets(tweet_id BIGINT PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    tweet VARCHAR(255),
    ticker VARCHAR(63),
    tweet_date TIMESTAMP,
    sentiment BIGINT
    );`
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Drop tweets table
 */
const dropTweetsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS tweets;'
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Create tweets table
 */
const createTickersTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
    tickers(ticker_id UUID PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    ticker VARCHAR(63),
    exchange VARCHAR(63)
    );`
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Drop tweets table
 */
const dropTickersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS tickers;'
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Create all tables
 */
const createAllTables = () => {
  createTweetsTable()
  createTickersTable()
}

/**
  * Drop all tables
  */
const dropAllTables = () => {
  dropTweetsTable()
  dropTickersTable()
}

module.exports = {
  createAllTables,
  dropAllTables
}

require('make-runnable')
