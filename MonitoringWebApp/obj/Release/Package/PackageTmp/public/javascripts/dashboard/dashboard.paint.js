$(function () {
  var paint = {
    defaultColor: '#ffffff',
    drillDisabledColor: '#a8a8a8',
    millDisabledColor: '#a8a8a8',
    colorPalette: [
      ['#CC0613', '#008141', '#FFFF00', '#ff7f7f'],
      ['#8A96FF', '#c47604', '#00e5ee']
    ],
    elements: [],

    init: function () {
      var elements = [];

      for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 11; j++) {
          var element = $(this.getElementId(i, j));

          element.spectrum({
            color: this.defaultColor,
            showPaletteOnly: true,
            showPalette: true,
            palette: this.colorPalette
          });

          elements.push(element);
        }
      }

      this.elements = elements;

      return elements;
    },

    getElementId: function (row, col) {
      return ('#paint-' + row + '-' + col)
    },

    getColors: function () {
      var colorElements = [];

      for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 11; j++) {
          var colorElementId = $(this.getElementId(i, j));
          var colorElement = $(colorElementId).spectrum("get");
          var colorElementRgb = "#" + colorElement.toHex();

          //dont add default or disabled colors
          if (colorElementRgb !== paint.defaultColor &&
            colorElementRgb !== paint.drillDisabledColor &&
            colorElementRgb !== paint.millDisabledColor) {
            colorElements.push({
              row: i,
              col: j,
              hex: colorElementRgb
            });
          }
        }
      }

      return colorElements;
    },

    enable: function (ledMatrixElement) {
      var colorElementId = this.getElementId(ledMatrixElement.row, ledMatrixElement.col);

      var colorElement = $(colorElementId);

      if (colorElement.is(':disabled')) {
        colorElement.spectrum("enable");
        colorElement.spectrum({
          color: this.defaultColor,
          showPaletteOnly: true,
          showPalette: true,
          palette: this.colorPalette
        });
      }
    },

    disable: function (ledMatrixElement) {
      var colorElementId = this.getElementId(ledMatrixElement.row, ledMatrixElement.col);

      $(colorElementId).spectrum({
        color: (ledMatrixElement.color) ? ledMatrixElement.color : this.defaultColor,
        disabled: true
      });
    }
  };

  paint.init();

  window.paint = paint;
});