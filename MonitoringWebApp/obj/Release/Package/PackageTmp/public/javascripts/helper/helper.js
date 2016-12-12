$(function () {
  function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    return regex.test(email);
  }

  function getProductionCodes() {
    return {
      EMPTY: 0,
      DRILL: '00100000',
      MILL: '01000000',
      PAINT: '011'
    }
  };

  function dateToString(date) {
    return date.getFullYear() + '-' + ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + ' '
      + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  };

  function functionCodeToString(code) {
    switch (code) {
      case 0:
        return 'Not initialized';
      case 1:
        return 'Loading';
      case 2:
        return 'Unloading';
      case 3:
        return 'Drill & Mill';
      case 4:
        return 'Paint';
      case 5:
        return 'Transport';
      case 6:
        return 'Accepting order';
      case 7:
        return 'Returning order';
      case 8:
        return 'Order completion';
      default:
        return 'Invalid function code';
    }
  };

  function resultCodeToString(code) {
    switch (code) {
      case 0:
        return 'Not initialized';
      case 1:
        return 'Drill completed';
      case 2:
        return 'Mill completed';
      case 3:
        return 'Mill and Drill completed';
      case 4:
        return 'Paint completed';
      case 5:
        return 'Unmachined';
      case 6:
        return 'Waste';
      case 7:
        return 'Component loaded';
      case 8:
        return 'Component unloaded';
      case 9:
        return 'No component';
      case 10:
        return 'Transport completed';
      case 11:
        return 'Transport denied';
      case 12:
        return 'Producton order available';
      case 13:
        return 'Producton order issued';
      case 14:
        return 'Producton order read. Order continue';
      case 15:
        return 'Producton order read. Order completed';
      case 16:
        return 'Order denied';
      case 17:
        return 'Function not possible';
      default:
        return 'Invalid result code';
    }
  };

  function errorCodeToString(code) {
    switch (code) {
      case 0:
        return 'Ok';
      case 1:
        return 'Drill error';
      case 2:
        return 'Mill error';
      case 3:
        return 'Color error';
      case 4:
        return 'Load error';
      case 5:
        return 'Workpiece is missing';
      case 6:
        return 'Error returning production order';
      case 7:
        return 'Error reading production order';
      case 8:
        return 'Error during transport';
      case 9:
        return 'Invalid production order';
      case 10:
        return 'No order';
      case 11:
        return 'Parameter error';
      default:
        return 'Unknown error code';
    }
  };

  function hexColorToBin(hexColor) {
    switch (hexColor) {
      case '#CC0613': // red
        return '00000';
      case '#008141': // green
        return '00001';
      case '#007cC0': // blue
        return '00010';
      case '#ffff00': // yellow
        return '00011';
      case '#ff7f7f': // pink
        return '00100';
      case '#8a96ff': // purple
        return '00101';
      case '#c47604': // orange
        return '00110';
      case '#00e5ee': // turquoise
        return '00111';
      default:
        return '00000'; // white
    }
  };

  function convertBase(num) {
    return {
      from: function (baseFrom) {
        return {
          to: function (baseTo) {
            return parseInt(num, baseFrom).toString(baseTo);
          }
        };
      }
    };
  };

  convertBase.bin2dec = function (num) {
    return parseInt(convertBase(num).from(2).to(10));
  };

  window.helper = {
    dateToString: dateToString,
    resultCodeToString: resultCodeToString,
    functionCodeToString: functionCodeToString,
    errorCodeToString: errorCodeToString,
    hexColorToBin: hexColorToBin,
    bin2dec: convertBase.bin2dec,
    getProductionCodes: getProductionCodes,
    validateEmail: validateEmail
  };
});
