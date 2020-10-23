const redis = require('redis')

// const isProduction = process.env.NODE_ENV === 'production'
// const redisClient = redis.createClient({
//   port: isProduction ? process.env.REDIS_PORT_PROD : 6379,
//   host: isProduction ? process.env.REDIS_HOST_PROD : 'localhost'
// })
const redisClient = redis.createClient({
  port: process.env.REDIS_PORT_PROD,
  host: process.env.REDIS_HOST_PROD
})

redisClient.on('connect', function () {
  console.log(`redis has connected with the following information. Port: ${process.env.REDIS_PORT_PROD}, Host: ${process.env.REDIS_HOST_PROD}`)
})
module.exports = redisClient
