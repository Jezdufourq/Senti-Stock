var natural = require('natural')
var Analyzer = natural.SentimentAnalyzer
var stemmer = natural.PorterStemmer
var analyzer = new Analyzer('English', stemmer, 'afinn')
const Analysis = {
  getSentiment (req, res) {
    console.log(analyzer.getSentiment(req.text))
    return Math.pow(analyzer.getSentiment(req.text), 2) * 100
  },
  // This function receives an array of text (look below) and then calculates the average sentiment off that text
  // input = ['this is a test', '']
  getAverageSentiment (req, res) {
    const inputTweetsArr = req.tweets
    const arrLength = inputTweetsArr.length
    console.log(`inputTweetsArr: ${inputTweetsArr}`)
    console.log(`arrLength: ${arrLength}`)
    var averageSentiment = 0
    inputTweetsArr.forEach((tweetText) => {
      averageSentiment += Math.pow(analyzer.getSentiment(tweetText), 2) * 100
    })
    console.log(`average: ${averageSentiment / arrLength}`)
    return averageSentiment / arrLength
  }
}

module.exports = {
  Analysis
}
