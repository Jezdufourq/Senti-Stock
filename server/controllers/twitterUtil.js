// import middleware
var Twitter = require('twitter')

// defining twitter middleware params
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
})

/* getTweetsText()
Description - gets the text for each of the tweets. Returns a promise.
*/
module.exports = {
  getTweetsText: async function getTweetsText (params) {
    var returnArr = []
    return await client.get('search/tweets', params)
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

  /* getAnalysis()
    Description - gets the detailed information for each of the tweets. Returns a promise.
    */
  getTweetsDetailed: async function getTweetsDetailed (params) {
    return await client.get('search/tweets', params)
      .then((response) => {
        return response.statuses
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
