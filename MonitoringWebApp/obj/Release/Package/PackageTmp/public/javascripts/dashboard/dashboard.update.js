$(function () {
  function getDeviceOrders(deviceId) {
    return new Promise(function (resolve, reject) {
      $.ajax('api/device/orders?deviceId=' + deviceId, {
        'type': 'GET',
        'processData': false,
        'contentType': 'application/json'
      }).done(function (data) {
        resolve(data);
      })
      .fail(function (error) {
        reject(error);
      });
    });
  };

  function updateDashboard() {
    var deviceId = window.device.getId(),
      process = window.process,
      errors = window.errors,
      validDeviceId = window.device.notifyIfInvalidDeviceId();

    if (!validDeviceId)
      return;

    errors.showLoading();
    process.showLoading();

    getDeviceOrders(deviceId).then(function (result) {
      if (result.length == 0) {
        errors.hideLoading();
        process.hideLoading();
        return;
      }

      errors.updateData(result);
      process.updateData(result);

    }, function (err) {
      console.log('Error while get device orders err:' + err);
    });
  };

  $('.form-update .btn-update').click(function () {
    updateDashboard();
  });

  window.updateDashboard = updateDashboard;
});
