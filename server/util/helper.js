const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * Helper class with helper functions
 */
const Helper = {
  /**
     * Hash password method
     * Used to hash the password before it is persisted into the database
     */
  hashPassword (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },

  /**
   * Compare passwords
   * used to compare the passwords when querying the database
   */
  comparePassword (hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword)
  },

  /**
   * Generate Token
   * used to generate a json web token for stateless authentication
   */
  generateToken () {
    const token = jwt.sign({
      userId: id
    },
    process.env.JWT_SECRET, { expiresIn: '7d' }
    )
    return token
  }

}

module.exports = {
  Helper
}
