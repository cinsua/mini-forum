const mongoose = require('mongoose');
const User = require('../models/users');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

async function bdConnect(connUri){

    mongoose.connect('mydomino', {useNewUrlParser: true}) //connUri
    
}

module.exports = {
    add: async (req, res) => {
        let result = {};
        let status = 201;
        await mongoose.connect(connUri, {useNewUrlParser: true})
            .catch((e)=>{console.log(e);
                result.error = e;
                result.status = 500;
                res.status(500).send(result);
            })
        const { name, password } = req.body;
        const user = new User({name, password })
        let saved = await user.save()
            .catch((e)=>{console.log(e);
                result.error = e;
                result.status = 500;
                res.status(500).send(result);
            })
        result.status = status;
        result.result = saved;
        res.status(status).send(result);


        /*
        mongoose.connect(connUri, { useNewUrlParser : true }, async (err) => {
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
                
            
            //result = await user.save()
            //    .catch((err)=>{console.log(err);
            //        result.error = err;
            //        result.status = 500;
            //        res.status(500).send(result);
            //    })
            //res.status(status).send(result);
            
            });
            */
      },
    getAll: (req, res) => {
        res.status(201).send({status: 201, result:'hello'});
    },
  }