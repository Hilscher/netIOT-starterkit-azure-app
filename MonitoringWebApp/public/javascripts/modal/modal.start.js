/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  var copy = new Clipboard('.copy');

  $.notifyDefaults({
    placement: {
      from: "bottom"
    },
    animate: {
      enter: "animated fadeInUp",
      exit: "animated fadeOutDown"
    }
  });

  /**
  * Welcome Modal
  **/
  $('#welcome-modal').modal('show');

  $('#welcome-modal .register').click(function () {
    var device = window.device,
      deviceName = $('#device-name').val(),
      email = $('#user-mail').val(),
      validEmail = window.helper.validateEmail(email);

    if (deviceName == '') {
      $('#device-name').focus();
      $('#alert-device').text('Please give your Starterkit a name.');
      $('#alert-device').fadeIn('fast');
      return;
    }

    $('#alert-device').hide();

    if (email == '' || !validEmail) {
      $('#user-mail').focus();
      $('#alert-email').text('Please enter a valid email adress.');
      $('#alert-email').fadeIn('fast');
      return;
    }

    $('#alert-email').hide();

    device.register(deviceName + '::' + email).then(function (result) {
      $('#device-connection').val(result);

      $('#device-name-dashboard').val(deviceName);
      $('#email-dashboard').val(email);

      $('#welcome-modal').modal('hide');
      $('#newkit-modal').modal('show');
    }, function (err) {
      $('#alert-conflict').fadeIn('fast');
    });
  });

  $('#welcome-modal .login').click(function () {
    var device = window.device,
      deviceName = $('#device-name').val(),
      email = $('#user-mail').val(),
      validEmail = window.helper.validateEmail(email);

    if (deviceName == '') {
      $('#device-name').focus();
      $('#alert-device').text('Please give your Starterkit a name.');
      $('#alert-device').fadeIn('fast');
      return;
    }

    $('#alert-device').hide();

    if (email == '' || !validEmail) {
      $('#user-mail').focus();
      $('#alert-email').text('Please enter a valid email adress.');
      $('#alert-email').fadeIn('fast');
      return;
    }

    $('#alert-email').hide();
    $('#device-name-dashboard').val(deviceName);
    $('#email-dashboard').val(email);

    device.get(deviceName + '::' + email).then(function (result) {
      if (result.errorMessage) {
        $('#welcome-modal').modal('hide');
        $('#register-modal').modal('show');

        $('#device-name-reg').val(deviceName);
        $('#user-mail-reg').val(email);
      } else {
        $('#welcome-modal').modal('hide');
        $('#existingkit-modal').modal('show');
      }
    });
  });

  /**
  * Register Modal
  **/
  $('#register-modal .next').click(function () {
    $('#register-modal').modal('hide');
    $('#newkit-modal').modal('show');
  });

  $('#register-modal .back').click(function () {
    $('#register-modal').modal('hide');
    $('#welcome-modal').modal('show');
  });

  $('#register-modal .next').click(function () {
    var device = window.device,
      deviceName = $('#device-name').val(),
      email = $('#user-mail').val();

    device.register(deviceName + '::' + email).then(function (result) {
      $('#device-connection').val(result);

      $('#register-modal').modal('hide');
      $('#newkit-modal').modal('show');
    });
  });

  /**
  * Existing Kit Modal
  **/
  $('#existingkit-modal .next').click(function () {
    $.notify({
      message: 'Welcome to your Starterkit Application!'
    }, {
        type: 'info'
      });

    window.updateDashboard();
  });

  /**
  * New Kit Modal
  **/
  $('#newkit-modal .next').click(function () {
    $.notify({
      message: 'Welcome to your Starterkit Application!'
    }, {
      type: 'info'
    });

    window.updateDashboard();
  });
});