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
        
        if (!req.status) req.status = 200
        //let status = req.status || 200
        if (process.env.NODE_ENV === 'development'){
            //console.log(`${server.tagGreen} [${req.originalUrl}] [${req.method}] [STATUS: ${req.status}]`)
            server.showReq(req)
        }
        res.send(result);
        return next();
    }
}