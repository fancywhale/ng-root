import {
  UITable,
  CONTEXT_NEW_DOWN,
  CONTEXT_NEW_UP,
  CONTEXT_RECALC,
} from '../../../shared/models';
import { eleFactory } from './eleFactory';
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
import { newRow } from '../services';

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

  afterInit() {
    this._contextMenuControl.on(CONTEXT_NEW_DOWN, (selections) => {
      this.addRowBelow(selections);
    });
    this._contextMenuControl.on(CONTEXT_NEW_UP, (selections) => {
      this.addRowAbove(selections);
    });
    this._contextMenuControl.on(CONTEXT_RECALC, (selections) => {
      this.recalc(selections);
    });
  }

  addRowAbove(selections) {
    if (!selections || !selections.length) return;
    let firstCell = selections[0];
    let currentTopRow = firstCell.row;
    if (!currentTopRow) throw new Error('row is not found in selected cell, there must be some internal error.');
    let row = newRow(this.tab);
    if (!row.cells) throw new Error('no cell is created, there must be some internal error.');
    
    if (firstCell.cellAbove) {
      row.cells.forEach((cell, colIndex) => {
        if (
          cell.group &&
          currentTopRow.cells[colIndex].value === currentTopRow.cells[colIndex].cellAbove.value
        ) {
          cell.group = true;
          cell.value = currentTopRow.cells[colIndex].value;
        }
      });
    }
    
    this.addRow(row, firstCell.rowDataIndex);
    this.regroupCells();
    this.scope.$apply();
  }

  addRowBelow(selections) {
    if (!selections || !selections.length) return;
    let lastCell = selections[selections.length - 1];
    let currentBottomRow = lastCell.row;
    if (!currentBottomRow) throw new Error('row is not found in selected cell, there must be some internal error.');
    let row = newRow(this.tab);
    if (!row.cells) throw new Error('no cell is created, there must be some internal error.');
    if (lastCell.cellBelow) {
      row.cells.forEach((cell, colIndex) => {
        if (cell.group && 
          currentBottomRow.cells[colIndex].value === currentBottomRow.cells[colIndex].cellBelow.value
        ) {
          cell.group = true;
          cell.value = currentBottomRow.cells[colIndex].value;
        }
      });
    }

    this.addRow(row, lastCell.rowDataIndex + 1);
    this.regroupCells();
    this.scope.$apply();
  }

  recalc(selections) {
    if (!selections || !selections.length) return;
    selections.forEach(cell => {
      if (isCalculate(
        this.columns,
        cell,
        this.rows,
        cell.rowDataIndex,
        cell.cellDataIndex,
        this.tab,
        this.scope.uimodule.tabs
      )) {
        reCalculate(this.columns, cell, this.rows, cell.rowDataIndex, cell.cellDataIndex, this.tab, this.scope.uimodule.tabs);
      }
    });
  }
  
  /**
   * @protected
   * generate ele string
   * @param {string} dataType 
   */
  _factoryCellStr(payload) { 
    let func = eleFactory[payload.cell.dataType] || (() => '');
    return func.apply(payload);
  }
}