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
  key: fs.readFileSync(config.ssl.feedback_host_cert_path + '/' + config.ssl.key_file, {encoding: 'utf-8'}),
  cert: fs.readFileSync(config.ssl.feedback_host_cert_path + '/' + config.ssl.cert_file, {encoding: 'utf-8'})
}

app.use(bodyParser.json());

app.post('/', function (req, res) {
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

app.post('/eidas', function(req, res) {
    let params = req.body;
    let mail = email.sendEidas(params);
    mail.then(
        function (response) {
            logger.info('Eidas email sent successfully: %s - %s', response, params.logTag);
            res.send();
        },
        function (err) {
            logger.error('An error occurred while sending eidas email: %s - %s', err, params.logTag);
            res.status(500).send();
        });
});

console.log("starting server on port:" + port)
logger.info('Initializing app with SMTP and mail configs: ' + JSON.stringify(config));
https.createServer(options, app).listen(port);
