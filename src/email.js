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
    fields.message, fields.email);
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
    text: 'Palautteen antaja \r\n' +
    'Sähköposti: ' + fields.email + '\r\n\r\n' +
    'Palautteen sisältö: \r\n' +
    '------------------ \r\n' +
    'Viesti: \r\n' + fields.message + '\r\n\r\n' +
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
  let repeats = fields.errorRepeats === 'virhe_toistuu' ? 'kyllä' : 'ei';

  let content = 'Palautteen antaja \r\n' +
  'Sähköposti: ' + fields.email + '\r\n\r\n' +
  'Palautteen sisältö: \r\n' +
  '------------------ \r\n' +
  'Palvelu: ' + fields.service + '\r\n' +
  'Palvelu, lisätiedot: ' + fields.serviceAdditional + '\r\n\r\n' +
  'Selain (automaattinen): ' + fields.userAgent + '\r\n' +
  'Selain (käyttäjän antama): ' + fields.browserGiven + '\r\n\r\n' +
  'Tunnistustapa: ' + fields.type + '\r\n';
  if (fields.type === 'pankki') {
    content = content + 'Minkä pankin tunnistusta käytit?: ' + fields.bank + '\r\n';
  } else if (fields.type === 'mobiili') {
    content = content + 'Minkä operaattorin mobiilivarmennetta käytit: ' + fields.mobileCertOperator + '\r\n\r\n';
  }
  content = content + 'Kuvaus virhetilanteesta: ' + fields.errorDescription + '\r\n' +
  'Virhesivun sisältö: ' + fields.errorMessage + '\r\n' +
  'Virheen tapahtumisaika: ' + fields.time + '\r\n' +
  'Virhekoodi: ' + fields.errorCode + '\r\n' +
  'Toistuuko virhe: ' + repeats + '\r\n\r\n' +
  'Alkuperäiset tiedot: ' + JSON.stringify(fields);

  let feedbackMail = {
    from: fromValue,
    to: config.mail.to,
    subject: config.mail.subject,
    text: content
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
