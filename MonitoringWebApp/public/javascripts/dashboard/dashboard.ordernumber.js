/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  $('#production-count').TouchSpin({
    min: 1,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10,
    postfix: '#'
  });
});