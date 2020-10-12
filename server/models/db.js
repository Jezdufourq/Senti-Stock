const { pool } = require('../config/dbConfig')

/**
 * Create user table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
    users(id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
        )`
  pool.query(queryText)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * Drop user table
 */

const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *'
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
  createUserTable()
}

/**
  * Drop all tables
  */
const dropAllTables = () => {
  dropUserTable()
}

module.exports = {
  createUserTable,
  dropUserTable,
  createAllTables,
  dropAllTables
}
