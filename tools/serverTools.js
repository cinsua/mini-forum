//require chalk module to give colors to console text
var chalk = require('chalk');
module.exports = {
 tagCyan: chalk.bold.cyan('[SERVER]'),
 tagYellow: chalk.bold.yellow('[SERVER]'),
 tagRed: chalk.bold.red('[SERVER]'),
 tagMagenta: chalk.bold.magenta('[SERVER]'),
 tagGreen: chalk.bold.green('[SERVER]')
}