//default response to all success scenarios

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
        res.status(status).send(result);
        next();
    }
}