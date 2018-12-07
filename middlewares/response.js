//default response to all success scenarios
var server = require('../tools/serverTools')

module.exports = {
    sendResponse: async function (req, res, next){
        
        res.setHeader('Content-Type', 'application/json');
        if (!req.data && !req.status){
            throw Error('bad request')
        }
        let result = {
            data: req.data,
            success: true
        }
        
        let status = req.status || 200
        if (process.env.NODE_ENV === 'development'){
            console.log(`${server.tagGreen} [${req.originalUrl}] [${req.method}] [STATUS: ${status}]`)
        }
        res.status(status).send(result);
        return next();
    }
}