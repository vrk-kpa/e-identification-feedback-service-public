'use strict';

const yaml = require('yaml-js');
const fs = require('fs');
const argv = require('yargs').argv;

module.exports.read = function () {
  let configFile = fs.readFileSync(argv.configPath, { encoding: 'utf-8' });
  let config = yaml.load(configFile);
  return config;
};
