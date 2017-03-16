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

function sendFeedback(fields) {
  logger.info('Send feedback email: %s - %s - %s',
    fields.message, fields.name, fields.email);
  logger.info('SMTP and mail configs: ' + JSON.stringify(config));
  let fromValue;
  if (fields.email.trim()) {
    fromValue = fields.email.trim();
  } else {
    fromValue = config.mail.from;
  }
  return transporter.sendMail({
    from: fromValue,
    to: config.mail.to,
    subject: config.mail.subject,
    text: 'Palautteen antaja \n\n' +
    'Nimi: ' + fields.name + '\n' +
    'Sähköposti: ' + fields.email + '\n\n' +
    'Palautteen sisältö: \n\n' +
    'Viesti: \n' + fields.message + '\n\n' +
    'Alkuperäiset tiedot: ' + JSON.stringify(fields)
  });
};

function sendErrorFeedback(fields) {
  logger.info('Send error feedback email: ', JSON.stringify(fields));
  logger.info('SMTP and mail configs: ' + JSON.stringify(config));
  let fromValue;
  if (fields.email.trim()) {
    fromValue = fields.email.trim();
  } else {
    fromValue = config.mail.from;
  }
  let feedbackMail = {
    from: fromValue,
    to: config.mail.to,
    subject: config.mail.subject,
    text: 'Palautteen antaja \n\n' +
    'Sähköposti: ' + fields.email + '\n\n' +
    'Palautteen sisältö: \n\n' +
    'Palvelu: ' + fields.service + '\n' +
    'Palvelu, lisätiedot: ' + fields.serviceAdditional + '\n\n' +
    'Selain (automaattinen): ' + fields.userAgent + '\n' +
    'Selain (käyttäjän antama): ' + fields.browserGiven + '\n\n' +
    'Tunnistustapa: ' + fields.type + '\n' +
    'Tunnistustapa/pankki: ' + fields.bank + '\n' +
    'Tunnistustapa/mobiilivarmenne: ' + fields.mobileCertOperator + '\n\n' +
    'Kuvaus virhetilanteesta: ' + fields.errorDescription + '\n' +
    'Virheen tapahtumisaika: ' + fields.time + '\n' +
    'Virhekoodi: ' + fields.errorCode + '\n' +
    'Toistuuko virhe: ' + fields.errorRepeats + '\n\n'
  };
  logger.info(JSON.stringify(feedbackMail));
  return transporter.sendMail(feedbackMail);
};


module.exports.send = function (form, fields) {
  if (form === 'feedback') {
      return sendFeedback(fields);
  } else if (form === 'errorfeedback') {
    return sendErrorFeedback(fields);
  }
};
