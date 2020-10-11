var express = require('express')
const asyncHandler = require('express-async-handler')
var router = express.Router()
const { pool } = require('../dbConfig')
const bcrypt = require('bcrypt')

router.get('/users/register', (req, res) => {
  console.log('register')
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end('register', 'utf-8')
})

router.post('/users/register', async (req, res, next) => {
  const { name, email, password, password2 } = req.body
  console.log({
    name,
    email,
    password,
    password2
  })
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  pool.query(
    `SELECT * FROM users
        WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        next(err)
      }
      if (results.rows.length > 0) {
        const err = new Error(
          `There is already a user registered with ${email} email`
        )
        err.status = 500
        next(err)
      } else {
        pool.query(`INSERT INTO users(name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, password`, [name, email, hashedPassword], (err, results) => {
          if (err) {
            next(err)
          }
          console.log(results.rows)
          // sending response back
          res.writeHead(200, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify(results.rows), 'utf-8')
          // req.flash('success_msg', 'You are now registered, Please log in')
        })
      }
    }
  )
})

router.get('/users/login', (req, res) => {
  console.log('login')
})

router.get('/users/authenticated', (req, res) => {
  console.log('user authenticated')
})

module.exports = router
