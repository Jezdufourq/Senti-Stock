var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const Cache = require('../controllers/cache')
const Database = require('../models/db')

router.get('/reset', asyncHandler(async function (req, res, next) {
  // await Cache.deleteCache()
  await Database.dropAllTables()
  await Database.createAllTables()
  res.status(200).send('Cache and database has been reset')
}))

module.exports = router
