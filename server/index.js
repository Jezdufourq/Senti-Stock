const createError = require("http-errors");
const path = require('path')
const express = require('express')
const port = process.env.PORT || 3000;

require("dotenv").config();

// Middleware
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");

//Enable Swagger Docs
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//Routes
const analysisRouter = require("./routes/analysis");
const tweetsRouter = require("./routes/tweets");
const tickerRouter = require("./routes/ticker");
const usersRouter = require("./routes/users");

//Init app
const app = express();

// setting up swaggerJsDoc
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "SentiStock APIs",
      description: "SentiStock API Information",
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["./routes/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions)

// SPA static assets
app.use(express.static('../client/dist/spa'))

// Middleware
app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware for logging
logger.token("req", (req, res) => {
    JSON.stringify(req.headers);
  })

  logger.token("res", (req, res) => {
    const headers = {};
    res.getHeaderNames().map(h => (headers[h] = res.getHeader(h)));
    return JSON.stringify(headers);
  })

// API routes
app.use("/api", analysisRouter);
app.use("/api", tweetsRouter)
app.use("/api", tickerRouter);
app.use("/api", usersRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes which arent associated to API will redirect to static assets for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/spa', 'index.html'));
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
  console.log(`Example app listening at http://localhost:${port}`)
})
