const {Client} = require('pg');

const client = new Client({
    user: "jezdufourq",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "senti-stock"
});

client.connect()
    .then(() => {console.log("Database has connected successfully")})
    .then(() => {client.query("create table TEST")})
    .catch(error => {console.log(error)})
    .finally(() => {client.end()})