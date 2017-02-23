'use strict';

const config = require('./config.js').read();
const logger = require('./logger.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
  port: config.smtp.port,
  host: config.smtp.host,
  secure: false,
  ignoreTLS: true}));

module.exports.send = function (service, browser, type, message, name, email) {
  logger.info('Send feedback email: %s - %s - %s - %s - %s - %s', service, browser, type, message, name, email);
  logger.info('SMTP and mail configs: ' + JSON.stringify(config));
  let fromValue;
  if (email.trim()) {
    fromValue = email;
  }
  else {
    fromValue = config.mail.from;
  }
  return transporter.sendMail({
    from: fromValue,
    to: config.mail.to,
    subject: config.mail.subject,
    text: 'Palautteen antaja \n\n' +
    'Nimi: ' + name + '\n' +
    'Sähköposti: ' + email + '\n\n' +
    'Palautteen sisältö: \n\n' +
    'Palvelu: ' + service + '\n' +
    'Selain: ' + browser + '\n' +
    'Tunnistustapa: ' + type + '\n' +
    'Viesti: \n' + message
  });
};
