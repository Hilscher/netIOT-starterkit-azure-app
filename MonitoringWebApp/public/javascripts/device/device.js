/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  function get(deviceId) {
    return new Promise(function (resolve, reject) {
      $.ajax('api/device?deviceId=' + deviceId, {
        'type': 'GET',
        'processData': false,
        'contentType': 'application/json'
      }).done(function (data) {
        console.log('Register device: ' + JSON.stringify(data));

        resolve(data);
      })
        .fail(function (error) {
          console.log('Register device error: ' + error);
          reject(error);
        });
    });
  };

  function register(deviceId) {
    return new Promise(function (resolve, reject) {
      $.ajax('api/device/register?deviceId=' + deviceId, {
        'type': 'POST',
        'processData': false,
        'contentType': 'application/json'
      }).done(function (data) {
        console.log('Register device: ' + JSON.stringify(data));

        if (data.errorMessage) {
          reject(data.errorMessage);
        } else {
          var key = data.authentication.SymmetricKey.primaryKey,
            connectionString = 'HostName=starterKitHub.azure-devices.net;DeviceId=' + deviceId + ';SharedAccessKey=' + key;

          resolve(connectionString);
        }
      })
      .fail(function (error) {
        console.log('Register device error: ' + error);
        reject(error);
      });
    });
  };

  function notifyIfInvalidDeviceId() {
    var deviceName = $('#device-name-dashboard').val(),
      email = $('#email-dashboard').val();

    if (deviceName == '') {
      $.notify({
        message: 'Please enter a Starterkit name.'
      }, {
          type: 'danger'
        });

      return false;
    }

    if (email == '' || !window.helper.validateEmail(email)) {
      $.notify({
        message: 'Please enter a valid email.'
      }, {
          type: 'danger'
        });

      return false;
    }

    return true;
  };

  function getId() {
    var deviceName = $('#device-name-dashboard').val(),
      email = $('#email-dashboard').val();

    return deviceName + '::' + email;
  };

  window.device = {
    get: get,
    register: register,
    getId: getId,
    notifyIfInvalidDeviceId: notifyIfInvalidDeviceId
  };
});
