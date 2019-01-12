//require chalk module to give colors to console text
const chalk = require('chalk')

module.exports = {

  tagCyan: chalk.bold.cyan('[SERVER]'),
  tagYellow: chalk.bold.yellow('[SERVER]'),
  tagRed: chalk.bold.red('[SERVER]'),
  tagMagenta: chalk.bold.magenta('[SERVER]'),
  tagGreen: chalk.bold.green('[SERVER]'),
  tagWhite: chalk.bold.white('[SERVER]'),

  pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
      return pad
    if (padLeft)
      return (pad + str).slice(-pad.length)
    else
      return (str + pad).substring(0, pad.length)
  },

  showTrace(errors, err) {
    console.log('\n')
    for (let error of errors) {
      let errBanner = chalk.bgRed(('ERROR'.padStart(38)).padEnd(80))
      console.log(errBanner)
      console.log(`[${error.name}] [${error.code}] [${error.message}]\n`)
    }
    console.log(err.stack)
  }
}