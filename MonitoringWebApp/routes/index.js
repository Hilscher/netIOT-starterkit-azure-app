/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

/*
 * Page routes.
 */

exports.index = function (req, res) {
  res.render('index', {
    title: 'netIOT Starterkit'
    , year: new Date().getFullYear()
    , deviceList: req.deviceList
  });
};
