const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'
const connectionString = process.env.DB_URL_DEV

const pool = new Pool({
  connectionString: isProduction ? process.env.DB_URL_PROD : connectionString
})

module.exports = pool
