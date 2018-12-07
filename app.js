//require('dotenv').config(); // Sets up dotenv as soon as our application starts
var express         = require('express')
                    // this module allow capture all errors, sync n async, by middlewares
                    // its a node patch, sounds bad, but is tradeoff for cleaner code
                    // eliminate the boilerplate from try/catch and wrappers
                    // express 5.0 should bring this in vanilla
                      require('express-async-errors');
const logger        = require('morgan'); //probably better with logger middleware
const bodyParser    = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const db            = require('./config/DB')

var app = express();
const router = express.Router();

// config variables
const CONFIG = require('./config/config.js');

var server = require('./tools/serverTools')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Passport
app.use(passport.initialize());

// CORS
app.use(cors());

//inicialize DB:
db.connectDB();

//Routes
const apiV1 = require('./routes/index.js');
app.use('/api/v1/', apiV1);

app.listen(`${CONFIG.PORT}`, () => {
  console.log(`${server.tagGreen} ${CONFIG.APP_NAME} started at ${Date().toString().slice(0, 24)}\n${server.tagCyan} Listening on Port${CONFIG.PORT}`);
  console.log(`${server.tagGreen} Version: ${CONFIG.VERSION} Commit:${CONFIG.COMMIT} Environment: ${process.env.NODE_ENV} `)
  
  
});

//npm run dev

/*
//'Win 7 workarount to properly get SIGINT
  // NOT WORKING
  // with git bash work out-of-box .. lol
var os = require('os');
if (os.type() === "Windows_NT"){
    //kernel < 8 is win7 or worse
    let kernel_release = os.release()
    kernel_release = kernel_release.substring(0, kernel_release.indexOf('.'));
    if ( kernel_release < 8 ){
      //we capture stdio and emit sigint
      require("readline")
        .createInterface({
          input: process.stdin,
          output: process.stdout
        })
        .on("SIGINT", function () {
          process.emit("SIGINT");
        });
    }

  }
  */