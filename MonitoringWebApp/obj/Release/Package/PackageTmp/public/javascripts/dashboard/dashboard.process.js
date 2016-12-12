$(function () {
  AmCharts.useUTC = true;

  var taskColors = ['#000000', '#042d85', '#85040c'],
    helper = window.helper,
    noDataMsg = 'There are currently no process entries available.',
    loadingDataMsg = 'Loading process data.';

  $('#comp-process .msg').text(noDataMsg);

  function showLoading() {
    $('#comp-process .msg').text(loadingDataMsg);
    $('#comp-process .msg').show();
    $('#process-chart').hide();
  };

  function hideLoading() {
    $('#comp-process .msg').text(noDataMsg);
    $('#comp-process .msg').show();
  };

  function initGanttChart(ganttData) {
    $('#comp-process .msg').hide();
    $('#process-chart').show();

    var chart = AmCharts.makeChart('process-chart', {
      'type': 'gantt',
      'theme': 'light',
      'period': 'ss',
      'dataDateFormat': 'YYYY-MM-DD HH:NN:SS',
      'balloonDateFormat': 'JJ:NN:SS',
      'columnWidth': 0.5,
      'valueAxis': {
        'type': 'date',
        'labelsEnabled': false 
      },
      'brightnessStep': 10,
      'dataProvider': ganttData.dataProvider,
      'graph': {
        'fillAlphas': 1,
        'balloonText': '<b>[[task]]</b>: [[open]] [[value]]'
      },
      'rotate': true,
      'categoryField': 'category',
      'segmentsField': 'segments',
      'colorField': 'color',
      'startDate': ganttData.startDate,
      'startField': 'start',
      'endField': 'end',
      'durationField': 'duration',
      'valueScrollbar': {
        'autoGridCount': true
      },
      'chartCursor': {
        'cursorColor': '#55bb76',
        'valueBalloonsEnabled': false,
        'cursorAlpha': 0,
        'valueLineAlpha': 0.5,
        'valueLineBalloonEnabled': true,
        'valueLineEnabled': true,
        'zoomable': false,
        'valueZoomable': true
      },
      'export': {
        'enabled': true
      }
    });
  };

  function getOrdersGroupByOrderNumber(orders) {
    var orderGroups = [],
      returnData = [];

    // Sort elements by ASC
    for (var i = orders.length - 1; i >= 0; i--) {
      var order = orders[i];

      if (!order['Order Input Data'])
        continue;

      if (!order['Order Input Data']['Order number'])
        continue;

      var orderNumber = order['Order Input Data']['Order number'].value,
        orderDuration = order['Order Input Data']['Duration'].value;

      if (orderDuration == 0)
        continue;

      if(!orderGroups[orderNumber])
        orderGroups[orderNumber] = [];

      orderGroups[orderNumber].push(order);
    }

    for (var i in orderGroups) {
      returnData.push(orderGroups[i]);
    }

    return returnData;
  };

  function updateData(orders) {
    if (orders.length == 0)
      return;

    var orderGroups = getOrdersGroupByOrderNumber(orders),
      processData = [],
      firstStartDate = new Date(orders[0]._ts * 1000),
      startDateString = helper.dateToString(firstStartDate);

    // Interate over groups
    for (var i in orderGroups) {
      var group = orderGroups[i],
        process = {
        'category': group[0]['Order Input Data']['Order number'].value,
        'segments': []
      };

      // Interate over group elements
      for (var j in group) {
        var elem = group[j],
          elemStartDate = new Date(elem._ts * 1000),
          elemDuration = elem['Order Input Data']['Duration'].value,
          elemFunction = elem['Order Input Data']['Function'].value,
          elemResult = elem['Order Input Data']['Result'].value,
          colorIndex = (elemFunction + elemResult) % 3,
          taskMsg = 'Function: ' + helper.functionCodeToString(elemFunction) + ' <br />Result: ' + helper.resultCodeToString(elemResult) + '<br />',
          startInSec = 0,
          segment = {};

        // Do not consider messages where the duration is equal to zero
        if (elemDuration == 0) {
          continue;
        }

        if (j == 0) {
          segment = {
            'start': startInSec,
            'duration': elem['Order Input Data']['Result'].value,
            'color': taskColors[colorIndex],
            'task': taskMsg
          };
        } else {
          segment = {
            'duration': elem['Order Input Data']['Result'].value,
            'color': taskColors[colorIndex],
            'task': taskMsg
          };
        }

        process.segments.push(segment);
      }
      processData.push(process);
    }

    // Draw gantt chart
    initGanttChart({
      dataProvider: processData,
      startDate: startDateString
    });
  };

  window.process = {
    showLoading: showLoading,
    hideLoading: hideLoading,
    updateData: updateData
  };
});
