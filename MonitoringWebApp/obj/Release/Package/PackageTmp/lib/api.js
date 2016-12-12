/**
 * Module dependencies.
 */
var hub = require('../lib/hub');
var config = require('../lib/config');
var database = require('../lib/database');

/**
 * Resource: Device
 */
function device(req, res) {
  var deviceId = req.query.deviceId;

  hub.getDevice(deviceId)
    .then(function (deviceInfo) {
      res.json(deviceInfo.deviceId);
    })
    .catch(function (err) {
      res.json({ errorMessage: err.toString() });
    });
};

function deviceRegister(req, res) {
  var deviceId = req.query.deviceId;

  hub.registerDevice(deviceId)
    .then(function (deviceInfo) {
      res.json(deviceInfo);
    })
    .catch(function (err) {
      res.json({ errorMessage: err.toString() });
    });
};

function deviceCommand(req, res) {
  var deviceId = req.query.deviceId,
    deviceCommand = req.body;

  console.log('Recieved command for device: ' + JSON.stringify(deviceCommand));

  hub.sendCommand(deviceId, deviceCommand)
    .then(function () {
      res.send();
    })
    .catch(function (err) {
      console.log('Error sending command: ' + err.toString());
      res.json({ errorMessage: err.toString() });
    });
};

function deviceOrders(req, res) {
  var deviceId = req.query.deviceId;
  var query = 'SELECT TOP 100 * FROM root r WHERE r.deviceId = "' + deviceId + '" ORDER BY r._ts DESC';

  database.getDatabase()
    .then(database.getCollection())
    .then(database.queryCollection(query)
      .then(function (result) {
        res.send(result);
      }))
    .catch(function (err) {
      console.log('Completed with error' + err.toString());
      res.json({ errorMessage: err.toString() });
    });
};

/**
 * Module exports.
 */

// GET api/device
exports.device = device;

// POST api/device/register
exports.deviceRegister = deviceRegister;

// POST api/device/command
exports.deviceCommand = deviceCommand;

// GET api/device/orders
exports.deviceOrders = deviceOrders;
