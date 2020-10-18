const { tickersDAO } = require('../models/tickersDAO')

module.exports = {
  getCurrentTickers: async function (req, res) {
    return tickersDAO.getTickers()
  },
  createTicker: async function (req, res) {
    tickersDAO.createTicker({ ticker: req.ticker, exchange: req.exchange })
  }
}
