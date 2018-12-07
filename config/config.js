// config variables
//
// env.json should not be public
// Just for ease of use, FOR NOW will be public
//
const config = require('./env.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
//merge environment with default
const CONFIG = Object.assign(defaultConfig, environmentConfig);
module.exports = CONFIG;