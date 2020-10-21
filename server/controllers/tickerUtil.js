const { tickersDAO } = require('../models/tickersDAO')

module.exports = {
  getCurrentTickers: async function (req, res) {
    return await tickersDAO.getTickers()
  },
  createTicker: async function (req, res) {
    await tickersDAO.createTicker({ ticker: req.ticker, exchange: req.exchange })
  },
  deleteTicker: async function (req, res) {
    await tickersDAO.deleteTicker({ tickerId: req.tickerId })
  }
}
