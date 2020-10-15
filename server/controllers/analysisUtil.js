const Sentiment = require('sentiment')
const sentiment = new Sentiment()

const Analysis = {
  /**
   * get sentiment on a certain stock ticker based on available data
   */
  getTickerSentiment (req, res) {
    const { ticker } = req.ticker
    const { data } = req.data
    const sentimentResult = sentiment.analyze(data)
    console.log(sentimentResult)
    res.send({ ticker: ticker, result: sentimentResult })
  }

}

module.exports = {
  Analysis
}
