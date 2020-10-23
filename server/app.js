// Express app config
const express = require('express')
const port = process.env.PORT || 8000
const isProduction = process.env.NODE_ENV === 'production'

// Middleware
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan')
const path = require('path')

// Enable Swagger Docs
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

// redis + db
const redisClient = require('./config/cacheConfig')
const pool = require('./config/dbConfig')

// Routes
const tweetsRouter = require('./api/tweets')
const tradingviewRouter = require('./api/tradingview')
const tickerRouter = require('./api/ticker')
const adminRouter = require('./api/admin')

// Database tables
// const db = require('./models/db')

// Init app
const app = express()
// setting up swaggerJsDoc
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'SentiStock APIs',
      description: 'SentiStock API Information',
      servers: ['http://localhost:8000']
    }
  },
  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

// SPA static assets
app.use(express.static('../client/dist/spa'))

// other middleware
app.use(logger('common'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// middleware for logging
logger.token('req', (req, res) => {
  JSON.stringify(req.headers)
})

logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => (headers[h] = res.getHeader(h)))
  return JSON.stringify(headers)
})

// API routes
// app.use('/api', analysisRouter)
app.use('/api/tradingview', tradingviewRouter)
app.use('/api/ticker', tickerRouter)
app.use('/api/tweets', tweetsRouter)
app.use('/api/admin', adminRouter)

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

// Routes which arent associated to API will redirect to static assets for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/spa', 'index.html'))
})

// Error handling
app.use((error, req, res, next) => {
  console.log('Error status: ', error.status)
  console.log('Message: ', error.message)
  // default to 500 for fallback
  res.status(error.status || 500)

  // Sends response
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack
  })
})
// Express app
app.listen(port, () => {
  // Create all the tables if they are not there
  // await db.createAllTables()
  console.log(`Example app listening at http://localhost:${port}`)
})
