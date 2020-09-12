const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//require dotenv to manage env variables
require("dotenv").config();

//port information
const hostname = 'localhost';
const port = 3000;

//Enable POST
const helmet = require("helmet");
const cors = require("cors");


//Enable Swagger Docs
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

//Routes
const analysisRouter = require("./routes/analysis");
const tweetsRouter = require("./routes/tweets");
//Init app
const app = express();

// Serve out any static assets correctly
app.use(express.static('../client/build/spa'))

//Middleware
app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//middleware for logging
logger.token("req", (req, res) => {
  JSON.stringify(req.headers);
})

logger.token("res", (req, res) => {
  const headers = {};
  res.getHeaderNames().map(h => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
})

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.

//routes setup
app.use("/api", analysisRouter);
app.use("/api", tweetsRouter)
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Any routes that don't match on our static assets or api should be sent to the React Application
// This allows for the use of things like React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/spa', 'index.html'));
})

//404 error handling
app.use(function(req, res, next) {
  next(createError(404));
})


//starting app
app.listen(port, function () {
  console.log(`Express app listening at http://${hostname}:${port}/`);
});