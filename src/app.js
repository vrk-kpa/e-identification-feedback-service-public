'use strict';

const email = require('./email.js');
const config = require('./config.js').read();
const logger = require('./logger.js');
const express = require('express');
const app = express();
// const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');

let port = 8443;

const options = {
  key: fs.readFileSync('/data00/deploy/ssl/' + config.ssl.key_file, {encoding: 'utf-8'}),
  cert: fs.readFileSync('/data00/deploy/ssl/' + config.ssl.cert_file, {encoding: 'utf-8'})
}

app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log('POST /');
  let params = req.body;
  let mail = email.send(params.form, params.content);
  mail.then(
    function (response) {
      logger.info('Feedback email sent successfully: %s', response);
      res.send();
    },
    function (err) {
      logger.error('An error occurred while sending feedback email: %s', err);
      res.status(500).send();
    });
});

console.log("starting server on port:" + port)
https.createServer(options, app).listen(port);
