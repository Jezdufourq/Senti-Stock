var natural = require('natural')
var tokenizer = new natural.WordTokenizer()
natural.PorterStemmer.attach()

const Parser = {
  tokenTweets (req, res) {
    return tokenizer.tokenize(req.text)
  },
  tokenAndStemTweets (req, res) {
    return req.text.tokenizeAndStem()
  }
}

module.exports = {
  Parser
}
