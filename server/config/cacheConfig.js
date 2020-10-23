const dotenv = require('dotenv')
dotenv.config()
const redis = require('redis')
const isProduction = process.env.NODE_ENV === 'production'
console.log(`production: ${isProduction}`)
console.log(`port: ${isProduction ? process.env.REDIS_PORT_PROD : process.env.REDIS_PORT_DEV}`)
console.log(`host: ${isProduction ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV}`)

const redisClient = redis.createClient({
  port: isProduction ? process.env.REDIS_PORT_PROD : process.env.REDIS_PORT_DEV,
  host: isProduction ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV
})

redisClient.on('connect', function () {
  console.log(`redis has connected with the following information. Port: ${isProduction ? process.env.REDIS_PORT_PROD : process.env.REDIS_PORT_DEV}, Host: ${isProduction ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV}`)
})

redisClient.on('error', function (err) {
  console.log('Error ' + err)
})

module.exports = {
  redisClient
}
