$(function () {
  var helper = window.helper,
    noDataMsg = 'There are currently no error log entries available.',
    loadingDataMsg = 'Loading error logs data.';

  $('#comp-logs .msg').text(noDataMsg);

  function showLoading() {
    $('#comp-logs .msg').text(loadingDataMsg);
    $('#comp-logs .msg').show();
    $('#comp-logs tbody').empty();
  };

  function hideLoading() {
    $('#comp-logs .msg').text(noDataMsg);
    $('#comp-logs .msg').show();
    $('#comp-logs .table-responsive').hide();
  };

  function updateData(orders) {
    $('#comp-logs .msg').hide();
    $('#comp-logs .table-responsive').show();

    for (var i in orders) {
      var order = orders[i];

      if (!order['Order Input Data'])
        continue;

      if (!order['Order Input Data']['Order number'])
        continue;

      var orderDate = helper.dateToString(new Date(order._ts * 1000)),
        orderId = order['Order Input Data']['Order number'].value,
        errorValue = order['Order Input Data'].Error.value,
        errorMsg = helper.errorCodeToString(errorValue),
        errorType = (errorValue) ? 'alert-danger' : 'alert-info',
        errorElement = '<tr class="' + errorType + '"><td>' + orderDate + '</td><td>' + orderId + '</td><td>' + errorMsg + '</td></tr>';

      $('#comp-logs tbody').append(errorElement);
    }
    $('#comp-logs .table-responsive').show();
  };

  window.errors = {
    showLoading: showLoading,
    hideLoading: hideLoading,
    updateData: updateData
  };
});
