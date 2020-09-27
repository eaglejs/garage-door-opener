const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 8080;
const originsWhitelist = [
  'http://192.168.1.191',
  'http://192.168.1.191:4200',
  'http://app.portal.com',
  'http://app.portal.com:4200'
];
const corsOptions = {
  origin: (origin, callback) => {
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  }
};
const APP = express();

let db = null;

// create mongodb connection
mongoose.connect('mongodb://mongo:27017/garage-door-opener', { useNewUrlParser: true});

db = mongoose.connection;

//add cors whitelist
APP.use(cors(corsOptions));

// parse incoming requests
APP.use(bodyParser.json());
APP.use(bodyParser.urlencoded({ extended: false }));

// 4. Force https in production
if (APP.get('env') === 'production') {
  APP.use(function (req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

// // include routes
// routes.forEach(route => {
//   APP.use('/api', route);
// });

// catch 404 and forward to error handler
APP.use((req, res, next) => {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last APP.use callback
APP.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// listen on port 3000
APP.listen(port, function() {
  console.log(`Express APP listening on port: ${port}`);
});