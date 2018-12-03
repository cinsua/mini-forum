const mongoose = require('mongoose');
const User = require('../models/users');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
            let result = {};
            let status = 201;
            if (err) {
                status = 500;
                console.log('here');
                
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            const { name, password } = req.body;
            const user = new User({ name, password }); // document = instance of a model
            // TODO: We can hash the password here before we insert instead of in the model
            user.save((err, user) => {
                if (err) {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    console.log(err);
                }
                result.status = status;
                result.result = user;
                res.status(status).send(result);
                });
            });
      },
  }