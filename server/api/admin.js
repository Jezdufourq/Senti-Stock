var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const Cache = require('../controllers/cache')
const Database = require('../models/db')

/**
 *
 * @swagger
 * /api/admin/reset:
 *  get:
 *   description: Clears the database and the cache
 *   produces:
 *    - application/json
 *   response:
 *    '200':
 *     description: 'A successful response.'
 *    '500':
 *     description: 'Internal server error'
 *
*/
router.get('/reset', asyncHandler(async function (req, res, next) {
  // await Cache.deleteCache()
  await Database.dropAllTables()
  await Database.createAllTables()
  res.status(200).send('Cache and database has been reset')
}))

module.exports = router
