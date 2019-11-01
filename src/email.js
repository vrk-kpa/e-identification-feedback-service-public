'use strict';

const config = require('./config.js').read();
const logger = require('./logger.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
  port: config.smtp.port,
  host: config.smtp.host,
  secure: config.smtp.secure,
  ignoreTLS: config.smtp.ignoreTLS,
  requireTLS: config.smtp.requireTLS
}));

function sendFeedback(fields) {
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
  return transporter.sendMail(feedbackMail);
};


module.exports.send = function (form, fields) {
  if (form === 'feedback') {
      return sendFeedback(fields);
  } else if (form === 'errorfeedback') {
    return sendErrorFeedback(fields);
  }
};

module.exports.sendEidas = function(fields) {
    let subjectValue = '[Suomi.fi-tunnistus] eIDAS-yhteydenottopyyntö palvelulle ' + fields.serviceName + ' (' + fields.entityID + ')';
    if ( config.env !== 'prod' ) {
        subjectValue = '[Suomi.fi-tunnistus TESTI] eIDAS-yhteydenottopyyntö palvelulle ' + fields.serviceName + ' (' + fields.entityID + ')';
    }
    let pretext = config.mail.eidas.pretext;
    if ( pretext && pretext.trim() ) {
        pretext +=  '\r\n\r\n';
    }
    return transporter.sendMail({
        from: config.mail.from,
        to: fields.eidasContactAddress,
        subject: subjectValue,
        text:
        pretext +
        'LÄHETTÄJÄN YHTEYSTIEDOT:\r\n\r\n' +
        'Sähköposti: ' + fields.email + '\r\n' +
        'Puhelinnumero: ' + fields.phonenumber + '\r\n\r\n' +
        'VIESTIN SISÄLTÖ:\r\n\r\n' +
        fields.message + '\r\n\r\n------------------\r\n\r\n' +
        config.mail.eidas.posttext
    });
}
