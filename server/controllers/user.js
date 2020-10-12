import moment from 'moment'
import uuidv4 from 'uuid/v4'
import db from '../models/db'
import Helper from '../util/helper'

const User = {
  /**
     * Create a user
     */
  async create (req, res, next) {
    // validation checking
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'You are missing an email or a password. Please enter these values' })
    }
  }

}
