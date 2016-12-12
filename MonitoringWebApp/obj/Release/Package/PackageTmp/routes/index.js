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
