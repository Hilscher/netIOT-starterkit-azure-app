/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var api = require('./lib/api');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

/**
 * Environment and middleware.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use(bodyParser.json());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Page navigation.
 */
app.get('/', routes.index);

/**
 * REST api routing.
 */
app.get('/api/device', api.device);
app.post('/api/device/register', api.deviceRegister);
app.post('/api/device/command', api.deviceCommand);
app.get('/api/device/orders', api.deviceOrders);

module.exports = app;