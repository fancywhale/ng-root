import * as events from 'events';
import { UICell } from './UICell.type';

let rowTracker = 0;

export const ROW_DEL_CHANGE = 'ROW_DEL_CHANGE';
export const ROW_INDEX_CHANGE = 'ROW_INDEX_CHANGE';
export const ROW_REMOVED = 'ROW_REMOVED';
export const ROW_CELLS_CHANGED = 'ROW_CELLS_CHANGED';
export const ROW_BEFORE_CELLS_CHANGED = 'ROW_BEFORE_CELLS_CHANGED';
export const ROW_CHECKED = 'ROW_CHECKED';


export class UIRow extends events.EventEmitter {

  set cells(value) {
    if (!value instanceof Array) {
      throw new Error('cells should be instance of Array');
    }
    const newCells = value.map(cellData => new UICell(cellData, this));
    this.emit(ROW_BEFORE_CELLS_CHANGED, this._cells, newCells);
    this._cells = newCells;
    this.emit(ROW_CELLS_CHANGED, this._cells);
  }
  get cells() {
    return this._cells;
  }

  get del() {
    return this._del;
  }

  set del(value) {
    this._del = value;
    this.emit(ROW_DEL_CHANGE, value);
  }

  set checked(value) {
    this._checked = value;
    this.emit(ROW_CHECKED, value);
  }

  get checked() {
    return this._checked;
  }

  /**
   * row index getter
   */
  get rowIndex() {
    return this._rowIndex;
  }

  set rowIndex(value) {
    this._rowIndex = value;
    this.emit(ROW_INDEX_CHANGE, value);
    this.cells.forEach(cell => {
      cell.onRowIndexChange();
    });
  }

  get table() {
    return this._table;
  }

  constructor(obj = {}, table, rowEle) {
    super();
    this.id = '';
    this._ele = rowEle;
    // this._ele = document.createElement('tr');
    // this._ele.classList.add('react-row');
    this._rowIndex = '';
    this._cells = [];
    this._del = false;
    this._$track = '';
    this._checked = false;
    this._data = obj;
    
    this._table = table;

    this.setMaxListeners(50);

    // not firing any event
    let data = Object.assign({}, obj);
    data.cells && delete data.cells;
    Object.assign(this, data);

    this._init();
  }

  _init() {
    // bind inner event listener
    this.on(ROW_CELLS_CHANGED, this._cellsChanged.bind(this));
    this.on(ROW_BEFORE_CELLS_CHANGED, this._beforeCellChanged.bind(this));

    if (!this._$track) {
      this._$track = rowTracker++;
    }

    // add cells;
    if (this._data.cells) {
      this._data.cells.forEach((cellData, colIndex) => {
        let cell = new UICell(cellData, this, this._ele.cells[colIndex]);
        this._cells.push(cell);
      });
    }
  }

  remove() {
    let $ele = $(this._ele);
    $ele.off();
    $ele.remove();
    let index = this._table.rows.indexOf(this);
    this._table.rows.splice(index, 1);
    this._cells.forEach(cell => {
      cell.dispose();
    });
    // raise del event;
    this.emit(ROW_REMOVED, this, index);
    this.removeAllListeners();
  }

  addCell(cellData) {
    let cell = new UICell(cellData, this);
    this._cells.push(cell);
    // raise cell add event;

    return cell;
  }

  /**
   * append this tr element to tbody at given index
   * @param {number} index 
   */
  append(index) {
    let $table = $(this._table);
    let $rows = $table.find('tr.react-row');
    let $ele = $(this._ele);
    if (!$rows.length) {
      $table.prepend(this._ele);
    } else {
      if (index < $rows.length) {
        $ele.insertBefore($rows[index]);
      } else {
        $ele.insertAfter($rows[$rows.length - 1]);
      }
    }
  }

  _cellsChanged(cells) {
    if (this._ele) {
      cells.forEach(cell => {
        this._ele.appendChild(cell._ele);
      });
    }
  }

  _beforeCellChanged(oldCells, newCelss) {
    oldCells.forEach(cell => cell.dispose.bind(cell));
  }

}