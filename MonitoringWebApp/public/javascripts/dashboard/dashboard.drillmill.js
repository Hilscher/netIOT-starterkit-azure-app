/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

$(function () {
  var colorSelector = window.paint,
    drillData = [],
    millData = [],
    selectable = {
      init: function (element, stop, selected, unselected) {
        $(element).bind('mousedown', function (e) {
          e.metaKey = true; //prevent strg selection
        }).selectable({
          stop: stop,
          selected: selected,
          unselected: unselected, //enable toggle select
          selecting: function (event, ui) { //prevent lassoing selection
            $(event.target).children('.ui-selecting').not(':first').removeClass('ui-selecting');
          }
        });
      },

      drillSelected: function (event, ui) { //enable toggle select
        var row = $(ui.selected).data('row'),
          col = $(ui.selected).data('col');

        $(ui.selected).toggleClass('active');

        if ($(ui.selected).hasClass('disabled')) { //dont process a click on an disabled cell
          $(ui.selected).removeClass('ui-selectee ui-selected click-selected');
        } else {
          //disable near by drill cells
          $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + col + '"]').addClass('disabled');
          $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + col + '"]').addClass('disabled');

          $('#selectable-drill li[data-row="' + row + '"][data-col="' + (col + 1) + '"]').addClass('disabled');
          $('#selectable-drill li[data-row="' + row + '"][data-col="' + (col - 1) + '"]').addClass('disabled');

          //disable mill cell
          $('#selectable-mill li[data-row="' + row + '"][data-col="' + col + '"]').addClass('disabled');

          //disable paint selector
          colorSelector.disable({ row: row, col: col, color: colorSelector.drillDisabledColor });
        }

        if (!$(ui.selected).hasClass('active')) {
          selectable.drillDisable(ui.selected);
        }
      },

      drillUnselected: function (event, ui) {
        selectable.drillDisable(ui.unselected);
      },

      drillDisable: function (element) {
        var row = $(element).data('row'),
          col = $(element).data('col');

        if ($(element).hasClass('ui-selected'))
          return;

        //disable drill cell
        $(element).removeClass('ui-selectee ui-selected click-selected');

        //enable mill cell
        $('#selectable-mill li[data-row="' + row + '"][data-col="' + col + '"]').removeClass('disabled');

        //enable paint cell
        colorSelector.enable({ row: row, col: col });

        //if possible enable nearby drill cells
        var bottomLeft = $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + (col - 1) + '"]');
        var bottomRight = $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]');
        var bottomMiddle = $('#selectable-drill li[data-row="' + (row + 2) + '"][data-col="' + (col) + '"]');

        var topLeft = $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + (col - 1) + '"]');
        var topRight = $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + (col + 1) + '"]');
        var topMiddle = $('#selectable-drill li[data-row="' + (row - 2) + '"][data-col="' + (col) + '"]');

        var rightTop = $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + (col + 1) + '"]');
        var rightBottom = $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]');
        var rightMiddle = $('#selectable-drill li[data-row="' + (row) + '"][data-col="' + (col + 2) + '"]');

        var leftTop = $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + (col - 1) + '"]');
        var leftBottom = $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + (col - 1) + '"]');
        var leftMiddle = $('#selectable-drill li[data-row="' + (row) + '"][data-col="' + (col - 2) + '"]');

        if (!bottomLeft.hasClass('ui-selected') && !bottomRight.hasClass('ui-selected') && !bottomMiddle.hasClass('ui-selected')) {
          $('#selectable-drill li[data-row="' + (row + 1) + '"][data-col="' + col + '"]').removeClass('disabled');
        }

        if (!rightTop.hasClass('ui-selected') && !rightBottom.hasClass('ui-selected') && !rightMiddle.hasClass('ui-selected')) {
          $('#selectable-drill li[data-row="' + (row) + '"][data-col="' + (col + 1) + '"]').removeClass('disabled');
        }

        if (!leftTop.hasClass('ui-selected') && !leftBottom.hasClass('ui-selected') && !leftMiddle.hasClass('ui-selected')) {
          $('#selectable-drill li[data-row="' + (row) + '"][data-col="' + (col - 1) + '"]').removeClass('disabled');
        }

        if (!topLeft.hasClass('ui-selected') && !topRight.hasClass('ui-selected') && !topMiddle.hasClass('ui-selected')) {
          $('#selectable-drill li[data-row="' + (row - 1) + '"][data-col="' + (col) + '"]').removeClass('disabled');
        }
      },

      drillStop: function (event, ui) { //serialize selected elements
        drillData = [];

        //read selected elements
        $('.ui-selected', this).each(function () {
          var row = $(this).data('row');
          var col = $(this).data('col');

          //push a new led matrix element
          drillData.push({ row: row, col: col });
        });
      },

      millSelected: function (event, ui) { //enable toggle select
        var row = $(ui.selected).data('row');
        var col = $(ui.selected).data('col');

        $(ui.selected).toggleClass('active');

        if ($(ui.selected).hasClass('disabled')) {
          //disable mill cell
          $(ui.selected).removeClass('ui-selectee ui-selected click-selected');
        } else {
          //disable paint cell
          colorSelector.disable({ row: row, col: col, color: colorSelector.millDisabledColor });
        }

        if (!$(ui.selected).hasClass('active')) {
          selectable.millDisable(ui.selected);
        }
      },

      millUnselected: function (event, ui) {
        selectable.millDisable(ui.unselected);
      },

      millDisable: function (element) {
        var row = $(element).data('row');
        var col = $(element).data('col');

        if ($(element).hasClass('ui-selected'))
          return;

        //remove mill cell
        $(element).removeClass('ui-selectee ui-selected click-selected');

        //enable mill cell
        $(element).removeClass('click-selected');

        //enable paint cell
        colorSelector.enable({ row: row, col: col });
      },

      millStop: function () { //serialize selected elements
        millData = [];

        //read selected elements
        $('.ui-selected', this).each(function () {
          var row = $(this).data('row');
          var col = $(this).data('col');

          millData.push({ row: row, col: col });
        });
      }
    };

  selectable.init('#selectable-drill', selectable.drillStop, selectable.drillSelected, selectable.drillUnselected);
  selectable.init('#selectable-mill', selectable.millStop, selectable.millSelected, selectable.millUnselected);

  window.drillmill = {
    getData: function () {
      return {
        drill: drillData,
        mill: millData
      }
    }
  };
});