import * as events from 'events';
import { UIRow, ROW_REMOVED, ROW_DEL_CHANGE } from './UIRow.type';

export const ADD_ROW_EVENT = 'ADD_ROW_EVENT';
export const BEFORE_ROWS_CHANGED = 'BEFORE_ROWS_CHANGED';
export const AFTER_ROWS_CHANGED = 'AFTER_ROWS_CHANGED';

/**
 * @abstract
 * abstract class
 */
export class UITable extends events.EventEmitter {

  set rows(value) {
    if (!value instanceof Array) {
      throw new Error('input must be instance of Array');
    }
    let newRows = value.map((rowData) => {return this._newRow(rowData)});
    let changes = this._findRowChange(this._rows, newRows);

    // raise rows before change event
    this.emit(BEFORE_ROWS_CHANGED, changes);
    // remove rows that left
    changes.rowsToRemove.forEach((r) => r.remove.bind(r));

    // add new rows
    this._createNewRows(newRows);
    // raise rows change event
    this.emit(AFTER_ROWS_CHANGED, this._rows);
  }

  get rows() {
    return this._rows;
  }

  get ele() {
    return this._ele;
  }

  get tabid() {
    return this._tabid;
  }

  get tab() {
    return this._tab;
  }

  get uimodule() {
    return this._uimodule;
  }

  get scope() {
    return this.__scope;
  }

  get tabIndex() {
    return this._uimodule.tabs.indexOf(this._tab);
  }

  /**
   * constructor of UITable
   * @param {*} tab 
   * @param {*} uimodule 
   */
  constructor(scope, tab, uimodule) {
    super();
    this.__scope = scope; // angular scope
    this._tab = tab;
    this._uimodule = uimodule
    this._tabid = tab.id;
    this._ele = document.createElement('tbody');
    this._rows = [];

    $(window).on('onload', function () {
      this.rows = [];
      $(window).off();
    });
  }

  /**
   * @abstract
   * abstract method that need to be implemented in inheritance
   * @param  {} cellData
   * @param  {} row Data
   * @param  {} colIndex
   * @param  {} rowIndex
   * @returns template
   */
  cellFactory(cell, row, uitab, colIndex, rowIndex, tabIndex, scope) { }
  
  init(data, tab) {
    if (!data.rows instanceof Array) {
      throw new Error('table rows should be instance of array.')
    }

    var startTime = Date.now();
    
    let rows = data.rows.map((row) => {
      return this._factoryRowStr(tab, row);
    }).join('');
    
    var startTime = Date.now();
    let tableEle = $(`<tbody>${rows}</tbody>`)[0];
    this._ele = tableEle;
    this._$ele = $(this._ele);
    
    data.rows.forEach((rowData, index) => {
      let row = new UIRow(rowData, this, tableEle.rows[index]);
      this._rows.push(row);
      this._initRow(row);
    });
  }

  addRow(rowData, position = this._rows.length) {
    let row = this._newRow(rowData);
    this._addRow(row, position);
    // raise row add event;
    this.emit(ADD_ROW_EVENT, row);
    return row;
  }

  deleteRows() {
    this._rows
      .filter(row => row.checked)
      .forEach(row => {
        row.remove();
      });
  }

  append(ele) {
    this._$ele.insertAfter($(ele).find('thead'));
  }

  _initRow(row) {
    row.on(ROW_DEL_CHANGE, this._regroupCells.bind(this));
    row.on(ROW_REMOVED, this._regroupCells.bind(this));
  }

  /**
   * create new row and append to table
   * @param {*} row 
   * @param {*} index 
   */
  _addRow(row, index) {
    this._rows.splice(index, 0, row);
    row.on(ROW_REMOVED, (r, index) => {
      for (let i = index; i < this._rows.length; i++){
        this._rows[i].rowIndex = i;
      };
    });
    this._initRow(row);

    // postbuild cells
    row.cells.forEach(cell => {
      cell.postBuild();
    });
    row.append(index);
  }

  _regroupCells() {
    let rows = this._rows;
    rows.forEach((row, rowIndex) => {
      if (row.del || row.hide) return;
      row.cells.forEach((cell, colIndex) => {
        let value = cell.value;
        if (cell.group) {
          cell.hide = false;
          cell.rowspan = 1;
        }
        if (!cell.hide && cell.group && rowIndex != 0) {
          var cellGroup = (step) => {
            if ((rowIndex - step) < 0) {
              return;
            }
            if (value === rows[rowIndex - step].cells[colIndex].value) {
              if (rows[rowIndex - step].cells[colIndex].hide
                || rows[rowIndex - step].del == true
                || rows[rowIndex - step].hide == true) {
                cellGroup(step + 1);
              } else {
                rows[rowIndex - step].cells[colIndex].rowspan++;
                cell.hide = true;
              }
            }
          };
          cellGroup(1);
        }
      });
    });
  }

  _newRow(rowData, ele = this._factoryRowEle(rowData)) {
    return new UIRow(rowData, this, ele);
  }

  _createNewRows(newRows) {
    for (let i = 0; i < newRows.length; i++){
      let newRow = newRows[i];
      let flag = !this._rows.find(oldRow => {
        if (newRow.id) {
          return oldRow.id === newRow.id
        } else {
          return newRow._$track === oldRow._$track;
        }
      });
      if (flag) {
        this._addRow(newRow, i);
      }
    }
  }

  /**
   * find rows leaving and coming before changes applied
   * @param {UIRow[]} oldRows 
   * @param {UIROW[]} newRows 
   */
  _findRowChange(oldRows, newRows) {
    let rowsToRemove = [];
    let rowsToCreate = [];
    if (!newRows || !newRows.length) {
      rowsToRemove = oldRows;
      rowsToCreate = [];
    } else {
      rowsToRemove = oldRows.filter((oldRow, i) => !newRows.find(newRow => {
        if (newRow.id) {
          return newRow.id === oldRow.id;
        } else {
          return newRow._$track === oldRow._$track;
        }
      }));
      rowsToCreate = newRows.filter((newRow, i) => !oldRows.find(oldRow => {
        if (newRow.id) {
          return oldRow.id === newRow.id
        } else {
          return newRow._$track === oldRow._$track;
        }
      }));
    }

    return {
      rowsToRemove,
      rowsToCreate,
    };
  }

  /**
   * factory row element
   * @param {{Object}} rowData 
   */
  _factoryRowEle(rowData) {
    return $(this._factoryRowStr(this.tab, rowData))[0];
  }

  /**
   * @abstract
   * factory cell's html string
   * @param {{cell, row, tab}} payload 
   */
  _factoryCellStr(payload) { }

  /**
   * factory row html by given tab and row data
   * @param {Object} tab data
   * @param {Object} row data
   */
  _factoryRowStr(tab, row) {
    let cells =  row.cells.map(cell => {
      let payload = {
        cell,
        row,
        tab,
      };
      return `
          <td>${this._factoryCellStr(payload)}</td>
        `;
    });
    return `<tr react-row>${cells.join('')}</tr>`;
  };
  
}
