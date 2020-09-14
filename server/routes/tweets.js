// middleware import
var express = require("express");
const asyncHandler = require('express-async-handler');
var router = express.Router();

// util import
var twitterUtil = require('../util/twitterUtil');
var tradingViewUtil = require('../util/tradingviewUtil');

var params = {
    q: null,
    lang: 'en',
    result_type: 'recent',
    count: 5
}

/* GET METHODS */
router.get("/tweets", asyncHandler(async function(req, res, next) {
    // query sanitization
    if(!req.query) {
        const err = new Error('Required query params missing. You must enter a stock ticker.');
        err.status = 400;
        next(err);
    }
    if(!req.query.ticker) {
        const err = new Error('Required query params missing. You must enter a stock ticker.');
        err.status = 400;
        next(err);
    }
    if(!req.query.count) {
        params.count = 10 // setting default to 10
    }
    if(!req.query.type) {
        params.result_type = 'recent' // setting default to 10
    }
    if(!req.query.lang) {
        params.lang = 'en' // setting default to 10
    }

    // ticker query sanitization
    // sanitize/lookup stock ticker
    var tradingViewResp = await tradingViewUtil.searchStockTickers(req.query.ticker).catch((error) => {console.log(error);});
    if (tradingViewResp.length == 0) {
        const err = new Error('You have entered an invalid stock ticker');
        err.status = 400;
        next(err);
    }

    // settings params
    params.q = req.query.ticker;
    params.count = req.query.count;
    params.result_type = req.query.type;
    params.lang = 'en';
    // send the data to the twitter API
    var twitterResp = await twitterUtil.getTweetsText(params).catch((error) => {console.log(error);});

    // sending response back
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(twitterResp), 'utf-8');
}));

router.get("/tweets-detailed", asyncHandler(async function(req, res, next) {
    // query sanitization
    if(!req.query) {
        const err = new Error('Required query params missing. You must enter a stock ticker.');
        err.status = 400;
        next(err);
    }
    if(!req.query.ticker) {
        const err = new Error('Required query params missing. You must enter a stock ticker.');
        err.status = 400;
        next(err);
    }
    if(!req.query.count) {
        params.count = 10 // setting default to 10
    }
    if(!req.query.type) {
        params.result_type = 'recent' // setting default to 10
    }
    if(!req.query.lang) {
        params.lang = 'en' // setting default to 10
    }

    // settings params
    params.q = req.query.ticker;
    params.count = req.query.count;
    params.result_type = req.query.type;
    params.lang = 'en';

    // ticker query sanitization
    // sanitize/lookup stock ticker
    var tradingViewResp = await tradingViewUtil.searchStockTickers(req.query.ticker).catch((error) => {console.log(error);});
    if (tradingViewResp.length == 0) {
        const err = new Error('You have entered an invalid stock ticker');
        err.status = 400;
        next(err);
    }

    // send the data to the twitter API
    var twitterResp = await twitterUtil.getTweetsDetailed(params).catch((error) => {console.log(error);});

    // sending response back
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(twitterResp), 'utf-8');
}));

module.exports = router;