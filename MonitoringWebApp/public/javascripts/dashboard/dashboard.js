/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  var gridster = $(".gridster > ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140]
  }).data('gridster').disable();
});
