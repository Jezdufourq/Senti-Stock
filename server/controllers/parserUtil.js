var natural = require('natural')
var tokenizer = new natural.WordTokenizer()
natural.PorterStemmer.attach()

const Parser = {
  tokenTweets (req, res) {
    console.log(tokenizer.tokenize(req.text))
    return tokenizer.tokenize(req.text)
  },
  tokenAndStemTweets (req, res) {
    console.log(req.text.tokenizeAndStem())
    return req.text.tokenizeAndStem()
  }
}

module.exports = {
  Parser
}
