const pool = require('../config/dbConfig')

/**
 * Creating the analysis table
 */
const createAnalysisTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
   analysis(analysis_id UUID PRIMARY KEY,
   created_date TIMESTAMP,
   modified_date TIMESTAMP,
   average_sentiment FLOAT8,
   ticker VARCHAR(63));`
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
const createTweetsTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS
    tweets(tweet_id BIGINT PRIMARY KEY,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    tweet VARCHAR(255),
    ticker VARCHAR(63),
    tweet_date TIMESTAMP,
    sentiment FLOAT8
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
 * Drop analysis table
 */
const dropAnalysisTable = () => {
  const queryText = 'DROP TABLE IF EXISTS analysis;'
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
  createAnalysisTable()
}

/**
  * Drop all tables
  */
const dropAllTables = () => {
  dropTweetsTable()
  dropTickersTable()
  dropAnalysisTable()
}

module.exports = {
  createAllTables,
  dropAllTables
}
