const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: isProduction ? process.env.DB_URL_PROD : process.env.DB_URL_DEV
})

pool.on('connect', () => {
  console.log(`postgres has connected with the following information. URL: ${isProduction ? process.env.DB_URL_PROD : process.env.DB_URL_DEV}`)
})

pool.on('error', (err) => {
  console.log('Error ' + err)
})

module.exports = pool
