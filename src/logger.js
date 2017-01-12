const winston = require('winston');
const config = require('./config.js').read();

const logger = new winston.Logger({
  transports: [new (winston.transports.File)({
    filename: config.log.file,
    level: config.log.level
  })]
});

module.exports = logger;

