//npm i express body-parser mysql2 swagger-autogen swagger-ui-express
const express = require('express');
const port = 3000;
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require("path");

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My API',
        description: 'תוכנת משימות מעולה'
    },
    host: `localhost:${port}`
};

const swaggerOutputFile = './swagger-output.json';
const routes = ['./app.js'];


swaggerAutogen(swaggerOutputFile, routes, doc);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(swaggerOutputFile);

var options = {
    explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

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

const madadim_R = require('./Routers/madadim_R');
app.use('/madadim', madadim_R);

const review_R = require('./Routers/review_R');
app.use('/review', review_R);

const history_R = require('./Routers/history_R');
app.use('/history', history_R);


app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});
