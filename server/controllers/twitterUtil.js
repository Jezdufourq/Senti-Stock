// import middleware
var Twitter = require('twitter')

// defining twitter middleware params
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
})

const Tweet = {
/**
 * getTweetsText()
 * Gets the text for each of the tweets. Returns a promise.
 */
  async getTweetsText (req, res) {
    var returnArr = []
    return await client.get('search/tweets', req.body)
      .then((response) => {
        response.statuses.forEach((status) => {
          returnArr.push(status.text)
        })
        returnArr.join(' ')
        return returnArr
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * getTweetsDetailed()
   * Gets the detailed information for each of the tweets. Returns a promise.
   */
  async getTweetsDetailed (req, res) {
    return await client.get('search/tweets', req.body)
      .then((res) => {
        return res.statuses
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
module.exports = {
  Tweet
}
