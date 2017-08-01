import {
  UICell,
  UIRow,
  UITable,
  CELL_DISPOSE,
  CELL_BEFORE_VALUE_CHANGED,
  CELL_BEFORE_VALUES_CHANGED,
  CELL_COLINDEX_CHANGED,
  CELL_COLSPAN_CHANGED,
  CELL_FONT_CHANGED,
  CELL_HIDE_CHANGED,
  CELL_NAME_CHANGED,
  CELL_REMOVED,
  CELL_ROWSPAN_CHANGED,
  CELL_VALUE_CHANGED,
  CELL_VALUES_CHANGED,
  CELL_WRITABLE_CHANGED,
  ROW_BEFORE_CELLS_CHANGED,
  ROW_CELLS_CHANGED,
  ROW_DEL_CHANGE,
  ROW_CHECKED,
  ROW_INDEX_CHANGE,
  ROW_REMOVED,
} from '../../../shared/models';
import { eleFactory } from '../../../shared/models/util';

import {
  createDateTime,
  createCheckBox,
  createDisable,
  createFileSelect,
  createHref,
  createLabel,
  createNumber,
  createSelect,
  createTab,
  createText,
  createTextarea,
  createUpload,
} from './factories';

angular.module('fx')
  .service('FxCellFactoryService', ['$filter', '$timeout', function ($filter, $timeout) {
    
    var CellFactoryService = {};
    var _clones = {};

    // 工厂函数库
    var factories = {
      checkbox: createCheckBox,
      select: createSelect,
      label: createLabel,
      href: createHref,
      TAB: createTab,
      text: createText,
      disable: createDisable,
      textarea: createTextarea,
      upload: createUpload,
      fileselect: createFileSelect,
      number: createNumber,
      datetime: createDateTime,
      id: function () {
        return null;
      }
    };

    CellFactoryService.pool = [];
    /**
     * @param  {} row Data
     * @param  {} cellData
     * @param  {} uitab
     * @param  {} index
     * @param  {} rowIndex
     * @returns template
     */
    CellFactoryService.factory = function (row, cell, uitab, index, rowIndex, tabIndex, scope) {
      var func = factories[cell.dataType];
      var input = {
        row: row,
        cell: cell,
        tab: uitab,
        index: index,
        rowIndex: rowIndex,
        $dataTable: uitab.table.tbody,
        scope: scope,
        tabIndex: tabIndex,
      };
      var content = func(input);
      return content;
    }

    return CellFactoryService;
  }]);