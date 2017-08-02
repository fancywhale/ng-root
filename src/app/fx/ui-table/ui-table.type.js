import { UITable } from '../../../shared/models';

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

/**
 * inheritance of UITable
 */
export class FXUITable extends UITable {
  /**
   * factory table by given table data and tab id
   * @param {Object} tableData 
   * @param {Object} tabid 
   */
  static factory(tableData, scope, tab, uimodule) {
    var table = new FXUITable(scope, tab, uimodule);
    table.init(tableData);
    return table;
  }

  /**
   * @param  {} cellData
   * @param  {} row Data
   * @param  {} colIndex
   * @param  {} rowIndex
   * @returns template
   */
  cellFactory(cell, row, colIndex, rowIndex) {
    var func = factories[cell.dataType];
    var input = {
      row: row,
      cell: cell,
      tab: this._tab,
      index: colIndex,
      rowIndex: rowIndex,
      $dataTable: this,
      scope: this.__scope,
      tabIndex: this.tabIndex,
    };
    var content = func(input);
    return content;
  }
}