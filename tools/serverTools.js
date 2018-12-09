//require chalk module to give colors to console text
var chalk = require('chalk');
module.exports = {
 tagCyan: chalk.bold.cyan('[SERVER]'),
 tagYellow: chalk.bold.yellow('[SERVER]'),
 tagRed: chalk.bold.red('[SERVER]'),
 tagMagenta: chalk.bold.magenta('[SERVER]'),
 tagGreen: chalk.bold.green('[SERVER]'),
 tagWhite: chalk.bold.white('[SERVER]'),
 pad: (pad, str, padLeft) => {
    if (typeof str === 'undefined') 
      return pad;
    if (padLeft) {
      return (pad + str).slice(-pad.length);
    } else {
      return (str + pad).substring(0, pad.length);
    }
  },
  showReq: (req, err)=>{
    let request = `[REQUEST]`
    let method =''
    if (method === 'DELETE') method = 'DLT'
    if (method === 'PATCH') method = 'PTCH'
    switch(req.method) {
        case 'GET':
          method = chalk.blue('[ GET  ]')
          break;
        case 'POST':
          method = chalk.green('[ POST ]')
          break;
        case 'DELETE':
          method = chalk.magenta('[DELETE]')
          break;
        case 'PATCH':
          method = chalk.yellow('[PATCH ]')
          break;
        default:
          method = chalk.red('[OTHER ]')
      }
    let status = ''
    if (req.status < 300){
        status = chalk.green(`[${req.status}]`)
    }else if(req.status < 500){
        status = chalk.yellow(`[${req.status}]`)
    }else{
        status = chalk.bold.red(`[${req.status}]`)
    }
    let error = ' '
    if(err){
        error = chalk.bold.red(` [${err.code}] [${err.name}] `)
        request = chalk.bold.red(request)
    }

    console.log(`${request} ${method} ${status}${error}${req.originalUrl}`)


  },
  showTrace: (errors, err)=>{
    console.log('\n')
    for (error of errors){
      errBanner = chalk.bgRed(('ERROR'.padStart(38)).padEnd(80))
      console.log(errBanner)
      console.log(`[${error.name}] [${error.code}] [${error.message}]\n`)
    }
    console.log(err.stack)
  }
}