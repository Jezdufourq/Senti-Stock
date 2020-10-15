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
}

/**
  * Drop all tables
  */
const dropAllTables = () => {
  dropTweetsTable()
  dropSentimentTable()
}

module.exports = {
  createAllTables,
  dropAllTables
}

require('make-runnable')

/**
 * Create user table
 */
// const createUserTable = () => {
//   const queryText =
//     `CREATE TABLE IF NOT EXISTS
//     users(id UUID PRIMARY KEY,
//         email VARCHAR(255) NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         created_date TIMESTAMP,
//         modified_date TIMESTAMP
//         )`
//   pool.query(queryText)
//     .then((res) => {
//       console.log(res)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

/**
 * Drop user table
 */

// const dropUserTable = () => {
//   const queryText = 'DROP TABLE IF EXISTS users returning *'
//   pool.query(queryText)
//     .then((res) => {
//       console.log(res)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }
