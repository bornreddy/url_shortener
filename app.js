var express = require('express');
var mongoose = require('mongoose');
var debug = require('debug')('url');

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to my database!");
  
  var path = require('path');
  var favicon = require('static-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var crypto = require('crypto');

  var routes = require('./routes/index');
  var shorten = require('./routes/shorten');

  var app = express();
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));


  //my real real stuff
  app.use('/',routes);
  app.post('/input',shorten.generate_short)
  app.use('/:short',shorten.short_redirect)


  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  /// error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });


  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
  module.exports = app;
});

//If error on mongoose connection startup
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB my database on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB : database disconnected');
});


var gracefulExit = function() { 
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB : database is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

try {
  // options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
  mongoose.connect('mongodb://localhost/test');
  console.log("Trying to connect to DB");
} catch (err) {
  console.log("Sever initialization failed " , err.message);
}
