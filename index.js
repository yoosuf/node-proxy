const express = require('express');
const morgan = require("morgan");
const request = require('request');
var cors = require('cors');
require('dotenv').config()

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.APP_PORT;
const HOST = process.env.APP_URL;
const API_SERVICE_URL = process.env.API_BASE_PATH;


app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  }));
// Logging
app.use(morgan('dev'));


// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.json({"message" : "This is a proxy service."})
 });


console.log(process.env.APIKEY)


app.use('/api', function(req, res) {
    let url = API_SERVICE_URL+ req.url;
    let r = null;
    if(req.method === 'POST') {
        r = request.post({uri: url, json: req.body});
    } else {
        r = request(url);
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    req.headers['x-api-key'] = process.env.API_KEY
    req.pipe(r).pipe(res);
});

app.all('/', function(req, res) {
    app.use(express.static('dist'))
});


app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
