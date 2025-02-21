//npm i express body-parser mysql2
const express = require('express');
const port = 3000;
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require("path");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/views')));

let db_M = require('./database');
global.db_pool = db_M.pool;

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "views" ,"page1.html"));
});
app.get('/page2', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "views" ,"page2.html"));
});
app.get('/page3', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "views" ,"page3.html"));
});
app.get('/page4', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "views" ,"page4.html"));
});

const user_R = require('./Routers/user_R');
app.use('/users', user_R);


app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});
