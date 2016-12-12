/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

/**
 * Module dependencies.
 */
var config = require('../lib/config');
var iotHub = require('azure-iothub');
var iotCommon = require('azure-iot-common');
var iotProtocol = require('azure-iot-device-mqtt').Mqtt;

/**
 * Module functions.
 */
function getDevice(deviceId) {
  var registry = iotHub.Registry.fromConnectionString(config.iotHub.connectionString);

  return new Promise(function (resolve, reject) {
    registry.get(deviceId, function (err, deviceInfo, res) {
      if (err) {
        console.error('Error while register device: ' + err.message);
        reject(err.message);
      }
      if (deviceInfo) {
        console.info('Ok while register device');
        resolve(deviceInfo);
      }
    });
  });
};

function registerDevice(deviceId) {
  var registry = iotHub.Registry.fromConnectionString(config.iotHub.connectionString);
  var device = new iotHub.Device(null);
  device.deviceId = deviceId;

  return new Promise(function (resolve, reject) {
    registry.create(device, function (err, deviceInfo, res) {
      if (err) {
        console.error('Error while register device: ' + err.message);
        reject(err.message);
      }
      if (deviceInfo) {
        console.info('Ok while register device');
        resolve(deviceInfo);
      }
    });
  });
};

function getDeviceList() {
  var registry = iotHub.Registry.fromConnectionString(config.iotHub.connectionString, iotProtocol);

  return new Promise(function (resolve, reject) {
    registry.list(function (err, deviceList) {
      if (err) {
        console.error('Error while connection: ' + err.message);
        reject(err);
      } else {
        console.log('Ok while loading device list');
        resolve(deviceList);
      }
    });
  });
};

function sendCommand(deviceId, command) {
  var data = JSON.stringify(command);
  var message = new iotCommon.Message(data);
  var client = iotHub.Client.fromConnectionString(config.iotHub.connectionString, iotProtocol);
  
  return new Promise(function (resolve, reject) {
    client.open(function (err) {
      if (err) {
        console.log('Error while opening iot hub client connection: ' + err);
        reject(err);
      } else {
        client.send(deviceId, message, function (err, res) {
          if (err) {
            console.log('Error while sending command: ' + err);
            reject(err);
          }
          else {
            console.log("Ok while sending command");
            resolve(res);
          }
        });
      }
    });
  });
};

/**
 * Module exports.
 */
module.exports = {
  getDevice: getDevice,
  registerDevice: registerDevice,
  getDeviceList: getDeviceList,
  sendCommand: sendCommand
};