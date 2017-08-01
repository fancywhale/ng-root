import * as events from 'events';

let colTrack = 0;

export const CELL_COLINDEX_CHANGED = 'CELL_COLINDEX_CHANGED';
export const CELL_COLSPAN_CHANGED = 'CELL_COLSPAN_CHANGED';
export const CELL_ROWSPAN_CHANGED = 'CELL_ROWSPAN_CHANGED';
export const CELL_HIDE_CHANGED = 'CELL_HIDE_CHANGED';
export const CELL_REMOVED = 'CELL_REMOVED';
export const CELL_FONT_CHANGED = 'CELL_FONT_CHANGED';
export const CELL_BEFORE_VALUE_CHANGED = 'CELL_BEFORE_VALUE_CHANGED';
export const CELL_VALUE_CHANGED = 'CELL_VALUE_CHANGED';
export const CELL_BEFORE_VALUES_CHANGED = 'CELL_BEFORE_VALUES_CHANGED';
export const CELL_VALUES_CHANGED = 'CELL_VALUES_CHANGED';
export const CELL_NAME_CHANGED = 'CELL_NAME_CHANGED';
export const CELL_WRITABLE_CHANGED = 'CELL_WRITABLE_CHANGED';
export const CELL_DISPOSE = 'CELL_DISPOSE';
export const CELL_SELECTNAME_CHANGED = 'CELL_SELECTNAME_CHANGED';

export class UICell extends events.EventEmitter {

  get colIndex() {
    return this._colIndex;
  }

  set colIndex(value) {
    if (this._colIndex === value) return;
    this._colIndex = value;
    this.emit(CELL_COLINDEX_CHANGED, value);
  }

  get font() {
    return this._colIndex;
  }

  set font(value) {
    if (this._font === value) return;
    this._font = value;
    this.emit(CELL_FONT_CHANGED, value);
  }

  get rowspan() {
    return this._rowspan;
  }

  set rowspan(value) {
    if (this._rowspan === value) return;
    this._rowspan = value;
    this.emit(CELL_ROWSPAN_CHANGED, value);
  }

  get colspan() {
    return this._colspan;
  }

  set colspan(value) {
    if (this._colspan === value) return;
    this._colspan = value;
    this.emit(CELL_COLSPAN_CHANGED, value);
  }

  get hide() {
    return this._hide;
  }

  set hide(value) {
    if (this._hide === value) return;
    this._hide = value;
    this.emit(CELL_HIDE_CHANGED, value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (value == this._value) return;
    this.emit(CELL_BEFORE_VALUE_CHANGED, this._value, value);
    this._value = value;
    this.emit(CELL_VALUE_CHANGED, value);
  }

  get values() {
    return this._values;
  }

  set values(value) {
    if (this._values === value) return;
    this.emit(CELL_BEFORE_VALUES_CHANGED, this._values, value);
    this._values = value;
    this.emit(CELL_VALUES_CHANGED, this._values, value);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (this._name === value) return;
    this._name = value;
    this.emit(CELL_NAME_CHANGED, this._values, value);
  }

  get selectname(){
    return this._selectname;
  }

  set selectname(value) {
    this._selectname = value;
    this.emit(CELL_SELECTNAME_CHANGED, value);
  }

  get writable() {
    return this._writable;
  }

  set writable(value) {
    if (this._writable === value) return;
    this._writable = value;
    this.emit(CELL_WRITABLE_CHANGED, this._values, value);
  }

  get ele() {
    return this._ele;
  }

  constructor(obj = {}, row, cellEle) {
    super();
    // this._ele = document.createElement('td');
    this._ele = cellEle;
    this._$ele = $(this._ele);
    this._colIndex = 0;
    this._font = {};
    
    this._rowspan = 1;
    this._colspan = 1;
    this._hide = false;
    this._value = '';
    this._values = null;
    this._name = '';
    this._writable = false;
    this._selectname = '';
    
    this.align = '';
    this.color = null;
    this.dataType = '';
    this.defValue = '';
    this.dynamic = false;
    this.dynamicGroup = null;
    this.group = false;
    this.nowrap = false;
    this.property = '';
    this._row = row;
    this._table = row.table;
  
    // not firing any event;
    Object.assign(this, obj);

    this._row.on('ROW_INDEX_CHANGE', this._onRowIndexChange.bind(this));
    this.on(CELL_COLSPAN_CHANGED, this._updateSpan.bind(this));
    this.on(CELL_ROWSPAN_CHANGED, this._updateSpan.bind(this));
    this.on(CELL_HIDE_CHANGED, this._hideCell.bind(this));

    this._init();

  }

  setValue(value) {
    this._value = value;
  }

  /**
   * gabage collection
   */
  dispose() {
    this._$ele.off();
    this._$ele.remove();
    this.removeAllListeners();
    this._table = null;
    this.row = null;
    this.emit(CELL_DISPOSE, this);
  }
  
  /**
   * update cell id when rowIndex changed;
   * @param {number} index 
   */
  _onRowIndexChange(index) {
    this._updateID();
  }

  /**
   * update cell id
   */
  _updateID() {
    this._ele.id = ['td', this._table.tabid, this._row.rowIndex, this._colIndex].join('_');
  }

  /**
   * update cell span
   */
  _updateSpan() {
    this._$ele.attr('rowspan', this._rowspan || 1);
    this._$ele.attr('colspan', this._colspan || 1);
  }

  /**
   * hide cell
   */
  _hideCell() {
    if (this._hide) {
      this._ele.style.display = 'none';
    } else {
      this._ele.style.display = 'table-cell';
    }
  }
  
  /**
   * set align
   */
  _setAlign() {
    this._$ele.css({ 'text-align': this.align });
  }

  /**
   * init cell property
   */
  _init() {
    this._updateID();
    this._updateSpan();
    this._setAlign();
    this._hideCell();
    this._$ele.attr('data-type', this.dataType);
    this._ele.classList.add('react-cell');
  }

  
}
