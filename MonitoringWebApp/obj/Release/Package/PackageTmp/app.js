/**
 * Module Dependencies.
 */
var express = require('express');
var routes = require('./routes');
var api = require('./lib/api');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

/**
 * Environment and Middleware
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use(bodyParser.json());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Page Navigation.
 */
app.get('/', routes.index);

/**
 * REST API.
 */
app.get('/api/device', api.device);
app.post('/api/device/register', api.deviceRegister);
app.post('/api/device/command', api.deviceCommand);
app.get('/api/device/orders', api.deviceOrders);

/**
* Error Handlers
*/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Development error handler that will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
