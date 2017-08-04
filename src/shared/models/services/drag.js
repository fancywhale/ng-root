import * as events from 'events';

export class UIDrag extends events.EventEmitter {

  get selection() {
    return this._selection;
  }

  constructor(table) {
    super();
    this._dragging = false;
    this._table = table;
    this._tableEle = table.ele;
    
    this._startCell = null;
    this._endCell = null;

    this._selection = [];
    this._selectionMatric = null;
    this.init();
  }

  init() {
    let _that = this;
    $(this._tableEle).on('mousedown.uidrag', 'td.react-cell', function () {
      if (!this.__celldata.editable) return;
      _that._onMouseDown(this.__celldata);
    });

    $(this._tableEle).on('mousemove.uidrag', 'td.react-cell', function () {
      _that._onMousMove(this.__celldata);
    });

    $(this._tableEle).on('mouseup.uidrag', 'td.react-cell', function (e) {
      _that._onMouseUp();
      e.preventDefault();
      e.stopPropagation();
    });

    $('body').on('mouseup.uidrag', function () {
      _that._onMouseUp();
    });

    $(document).on('dragleave.uidrag', function () {
      _that._onMouseUp();
    });
  }

  dispose() {
    $(this._table.ele).off('.uidrage');
    this._table = null;
    this._tableEle = null;
  }

  select(cell) {
    this._startCell = cell;
    this._endCell = cell;
    this._updateSelection();
  }

  _onMouseDown(cell) {
    this._startCell = cell;
    this._endCell = cell;
    this._dragging = true;
    this._updateSelection();
  }

  _onMousMove(cell) {
    this._endCell = cell;
    if (this._dragging) {
      this._updateSelection();
    }
  }

  _onMouseUp(cell) {
    this._startCell = null;
    this._endCell = null;
    if (this._dragging) {
      this._dragging = false;
    }
  }

  _updateSelection() {
    let startCell = this._startCell;
    let endCell = this._endCell;

    let left = Math.min(startCell.cellDataIndex, endCell.cellDataIndex),
      right = Math.max(startCell.cellDataIndex, endCell.cellDataIndex),
      top = Math.min(startCell.rowDataIndex, endCell.rowDataIndex),
      bottom = Math.max(startCell.rowDataIndex, endCell.rowDataIndex);

    let newSelectionMatric = [
      [left, top],
      [right, bottom]
    ];

    let changes = this._compareMatric(newSelectionMatric, this._selectionMatric);
    
    changes.leavingMat.forEach(cellMat => {
      let cell = this._table.rows[cellMat[1]].cells[cellMat[0]];
      this._deselect(cell);
    });
    changes.enteringMat.forEach(cellMat => {
      let cell = this._table.rows[cellMat[1]].cells[cellMat[0]];
      this._select(cell);
    });

    this._selectionMatric = newSelectionMatric;
  }

  _compareMatric(_newMat, _oldMat) {
    let enteringMat = [];
    let leavingMat = [];
    
    if (!_oldMat) {
      for (let i = _newMat[0][0]; i <= _newMat[1][0]; i++) {
        for (let j = _newMat[0][1]; j <= _newMat[1][1]; j++) {
          enteringMat.push([i, j]);
        }
      }
      return {
        enteringMat,
        leavingMat
      };
    }

    let left = Math.min(_newMat[0][0], _oldMat[0][0]),
      right = Math.max(_newMat[1][0], _oldMat[1][0]),
      top = Math.min(_newMat[0][1], _oldMat[0][1]),
      bottom = Math.max(_newMat[1][1], _oldMat[1][1]);

    for (let i = left; i <= right; i++) {
      for (let j = top; j <= bottom; j++) {
        if (i < _newMat[0][0] || i > _newMat[1][0] || j < _newMat[0][1] || j > _newMat[1][1]) {
          if (i >= _oldMat[0][0] && i <= _oldMat[1][0] && j >= _oldMat[0][1] && j <= _oldMat[1][1]) {
            leavingMat.push([i, j]);
          }
        }
        if (i < _oldMat[0][0] || i > _oldMat[1][0] || j < _oldMat[0][1] || j > _oldMat[1][1]) {
          if (i >= _newMat[0][0] && i <= _newMat[1][0] && j >= _newMat[0][1] && j <= _newMat[1][1]) {
            enteringMat.push([i, j]);
          }
        }
      }
    }
    
    return {
      enteringMat,
      leavingMat,
    };
  }

  _findCellsInRange(matric) {
    let cellsInRange = []
    this._table.rows.forEach((row, rowIndex) => {
      row.cells.map((cell, colIndex) => {
        if (colIndex >= matric[0][0]
          && colIndex <= matric[1][0]
          && rowIndex >= matric[0][1]
          && rowIndex <= matric[1][1]) {
          cellsInRange.push(cell);
        }
      });
    });
    return cellsInRange;
  }

  _inSelection(cell) {
    return this._selection.find(_cell => _cell === cell);
  }

  _deselect(cell) {
    if (!cell.editable || !cell.visible) return;
    cell.ele.classList.remove('td_selected');
    this._selection.splice(this._selection.indexOf(cell));
  }

  _select(cell) {
    if (!cell.editable || !cell.visible) return;
    cell.ele.classList.add('td_selected');
    this._selection.push(cell);
  }
}
