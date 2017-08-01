import * as events from 'events';
import { UIRow, ROW_REMOVED } from './UIRow.type';
import { eleFactory } from './util';

export const ADD_ROW_EVENT = 'ADDROW_EVENT';
export const BEFORE_ROWS_CHANGED = 'BEFORE_ROWS_CHANGED';
export const AFTER_ROWS_CHANGED = 'AFTER_ROWS_CHANGED';

export class UITable extends events.EventEmitter {

  static factory(tableData, tabid) {
    var table = new UITable(tabid);

    table.init(tableData);

    return table;
  }

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

  constructor(tabid) {
    super();
    this._tabid = tabid;
    this._ele = document.createElement('tbody');
    this._rows = [];

    $(window).on('onload', function () {
      this.rows = [];
      $(window).off();
    });
  }

  init(data, tab) {
    if (!data.rows instanceof Array) {
      throw new Error('table rows should be instance of array.')
    }

    var startTime = Date.now();
    
    let rows = data.rows.map((row) => {
      let cells = row.cells.map(cell => {
        let payload = {
          cell,
          row,
          tab,
        };
        let func = eleFactory[cell.dataType] || (() => '');
        return `
          <td>${func.apply(payload)}</td>
        `;
      });
      return `<tr>
          ${cells.join('')}
        </tr>`;
    }).join('');
    console.log('table scripting time:', Date.now() - startTime);
    
    var startTime = Date.now();
    let tableEle = $(`<tbody>${rows}</tbody>`)[0];
    this._ele = tableEle;
    this._$ele = $(this._ele);
    console.log('table creating time:', Date.now() - startTime);
    
    data.rows.forEach((rowData, index) => {
      this._rows.push(new UIRow(rowData, this, tableEle.rows[index]));
    });
  }

  addRow(rowData) {
    let row = this._newRow(rowData);
    row.table = this;
    this._addRow(row, this._rows.index);
    // raise row add event;
    this.emit(ADDROW_EVENT, row);

    return row;
  }

  append(ele) {
    this._$ele.insertAfter($(ele).find('thead'));
  }

  _addRow(row, index) {
    this._rows.splice(index, 0, row);
    row.on(ROW_REMOVED, (r, index) => {
      for (let i = index; i < this._rows.length; i++){
        this._rows[i].rowIndex = i;
      };
    });
    row.append(index);
  }

  _newRow(rowData) {
    return new UIRow(rowData, this);
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
}
