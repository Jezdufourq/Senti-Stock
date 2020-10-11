var express = require("express");
const asyncHandler = require('express-async-handler');
var router = express.Router();
const { pool } = require('../dbConfig');


router.get("/users/register", (req, res) => {
    console.log("register");
});

router.post("/users/register", (req, res) => {
    let {name, email, password, password2} = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];
    // validation

    if(password != password2) {
        errors.push({message: "Passwords do not match!"});
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        name,
        email,
        password,
        password2
    }), 'utf-8');
});

router.get("/users/login", (req, res) => {
    console.log("login");
})


router.get("/users/authenticated", (req, res) => {
    console.log("user authenticated");
})


module.exports = router;