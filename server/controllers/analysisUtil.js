var natural = require('natural')
var Analyzer = natural.SentimentAnalyzer
var stemmer = natural.PorterStemmer
var analyzer = new Analyzer('English', stemmer, 'afinn')
const Analysis = {
  getSentiment (req, res) {
    console.log(analyzer.getSentiment(req.text))
    return Math.pow(analyzer.getSentiment(req.text), 2) * 100
  }
}

module.exports = {
  Analysis
}
