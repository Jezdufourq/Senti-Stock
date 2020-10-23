const Helper = require('../controllers/helper')
const moment = require('moment')
const uuidv4 = require('uuid/v4')
const pool = require('../config/dbConfig')

const User = {
  /**
     * Create a user
     */
  async create (req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'You are missing an email or a password. Please enter these values' })
    }

    const hashPassword = Helper.hashPassword(req.body.password)

    const createQuery = `INSERT INTO
    users(id, username, password, created_date, modified_date)
    VALUES($1, $2, $3, $4, $5)
    returning *`
    const insertedValues = [
      uuidv4(),
      req.body.email,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ]

    try {
      const { rows } = await pool.query(createQuery, insertedValues)
      // sending jwt token back to client
      const token = Helper.generateToken(rows[0].id)
      return res.status(201).send({ token })
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: `User with that email ${req.body.email} already exist` })
      }
      return res.status(400).send(error)
    }
  },

  /**
   * Login with a user
   */
  async login (req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'You are missing an email or a password. Please enter these values' })
    }

    const queryText = 'sELECT * FROM users WHERE email = $1'
    try {
      const { rows } = await pool.query(queryText, [req.body.email])
      if (!rows[0]) {
        return res.status(400).send({ message: 'You have provided the wrong email and password' })
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ message: 'You have provided the wrong email and password' })
      }
      // creating jwt token
      const token = Helper.generateToken(rows[0].id)
      return res.status(200).send({ token })
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  /**
   * Delete a user
   */
  async delete (req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *'
    try {
      const { rows } = await pool.query(deleteQuery, [req.user.id])
      if (!rows[0]) {
        return res.status(404).send({ message: 'user not found' })
      }
      return res.status(204).send({ message: 'deleted' })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = {
  User
}
