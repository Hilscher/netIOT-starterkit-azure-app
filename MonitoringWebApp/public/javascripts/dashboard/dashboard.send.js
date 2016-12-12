/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  var helper = window.helper;

  function ledToProdDataIndex(element) {
    return ((element.col * 7) - 1) - (element.row - 1);
  };

  function notifyIfInvalidProduction(orderId, prodCount) {
    if (isNaN(orderId)) {
      $.notify({
        message: 'Please enter a valid order number.'
      }, {
        type: 'danger'
      });

      return false;
    }

    if (isNaN(prodCount)) {
      $.notify({
        message: 'Please enter a valid production volume.'
      }, {
          type: 'danger'
        });

      return false;
    }

    return true;
  };

  // Send command
  $('#comp-command .send-command').click(function () {
    var prodCodes = helper.getProductionCodes(),
      orderId = parseInt($('#production-id').val()),
      prodCount = parseInt($('#production-count').val()),
      deviceId = window.device.getId(),
      paintData = window.paint.getColors(),
      drillData = window.drillmill.getData().drill,
      millData = window.drillmill.getData().mill,
      abLED = [],
      validProduction = false,
      validDeviceId = false;

    validProduction = notifyIfInvalidProduction(orderId, prodCount);

    if (!validProduction)
      return;

    validDeviceId = window.device.notifyIfInvalidDeviceId();

    if (!validDeviceId)
      return;

    for (var i = 0; i < 77; i = i + 1) {
      abLED[i] = prodCodes.EMPTY;
    }

    for (var i in drillData) {
      var drillIndex = ledToProdDataIndex(drillData[i]);
      abLED[drillIndex] = helper.bin2dec(prodCodes.DRILL);
    }

    for (var i in millData) {
      var millIndex = ledToProdDataIndex(millData[i]);
      abLED[millIndex] = helper.bin2dec(prodCodes.MILL);
    }

    for (var i in paintData) {
      var colorIndex = ledToProdDataIndex(paintData[i]);
      abLED[colorIndex] = helper.bin2dec(prodCodes.PAINT + helper.hexColorToBin(paintData[i].hex));
    }

    var command = {
      'Production Order Data': {
        'Order': {
          'size': 2,
          'type': 'Unsigned',
          'value': orderId
        },
        'Number': {
          'size': 2,
          'type': 'Unsigned',
          'value': prodCount
        },
        'Product': {
          'size': 2,
          'type': 'Unsigned',
          'value': 1
        },
        'Version': {
          'size': 2,
          'type': 'Unsigned',
          'value': 1
        },
        'Serial': {
          'size': 2,
          'type': 'Unsigned',
          'value': 1
        },
        'Reserved 1': {
          'size': 10,
          'type': 'Binary',
          'value': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        'LED Data': {
          'size': 77,
          'type': 'Binary',
          'value': abLED
        },
        'Reserved 2': {
          'size': 3,
          'type': 'Binary',
          'value': [0, 0, 0]
        },
      }
    };

    console.log('Sending order to: ' + deviceId + ' with following content: ' + JSON.stringify(command));

    // Call server API
    $.ajax('api/device/command?deviceId=' + deviceId, {
      'data': JSON.stringify(command),
      'type': 'POST',
      'processData': false,
      'contentType': 'application/json'
    }).done(function () {
      $.notify({
        message: 'A new order was send to your Starterkit.'
      }, {
        type: 'info'
      });
      console.log('Ok while sending command');
    })
    .fail(function () {
      console.log('Error while sending command');
    });
  });
});
