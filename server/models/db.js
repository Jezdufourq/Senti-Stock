const { pool } = require('../config/dbConfig')

/**
 * Create tweets table
 */
const createTweetsTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
    tweets(tweet_id BIGTINT PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    tweet VARCHAR(255),
    ticker VARCHAR(63),
    tweet_date TIMESTAMP,
    sentiment BIGTINT
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
  const queryText = 'DROP TABLE IF EXISTS tweets returning *;'
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
    tickers(ticker_id BIGTINT PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    ticker VARCHAR(63),
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
  const queryText = 'DROP TABLE IF EXISTS tweets returning *;'
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Create sentiment table
 */
const createSentimentTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
  sentiment(id UUID PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    analysis VARCHAR(63),
    ticker VARCHAR(63)
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
 * Drop sentiment table
 */
const dropSentimentTable = () => {
  const queryText = 'DROP TABLE IF EXISTS sentiment returning *;'
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
  createSentimentTable()
  createTickersTable()
}

/**
  * Drop all tables
  */
const dropAllTables = () => {
  dropTweetsTable()
  dropSentimentTable()
  dropTickersTable()
}

module.exports = {
  createAllTables,
  dropAllTables
}

require('make-runnable')
