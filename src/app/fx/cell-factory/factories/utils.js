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
} from '../../../../shared/models';

/**
 * utils
 */

export function bindFontStyle(cell, ele) {
  cell.on(CELL_FONT_CHANGED, () => {
    giveFontClass(cell, ele);
  });
}

export function bindID(tab, cell, row, ele, type) {
  let onIndexChanged = () => {
    _giveID(tab, cell, row, ele, type);
  }
  onIndexChanged();
  cell.on(CELL_COLINDEX_CHANGED, onIndexChanged);
  row.on(ROW_INDEX_CHANGE, onIndexChanged);
}

export function bindValue(cell, ele, scope) {
  ele.addEventListener('change', () => {
    cell.value = ele.value;
    window.changeflag = true;
    scope && scope.$apply();
  });
  cell.on(CELL_VALUE_CHANGED, () => {
    ele.value = cell.value;
  });
  ele.value = cell.value;
}

export function bindFocus(ele, cell, scope) {
  ele.addEventListener('focus', () => {
    scope.inputFocus(cell);
  });
}

export function bindBlur(cell, ele, tab, scope) {
  ele.addEventListener('blur', () => {
    cell.validate();
    scope.exeFuncs(tab);
    scope.$apply();
  });
}

export function _giveID(tab, cell, row, ele, type) {
  ele.id = [type, tab.id, row.rowIndex, cell.colIndex].join('_');
}

export function giveFontClass(cell, ele) {
  if (cell.font && cell.font.bold) {
    ele.classList.add('font-bold-row');
  } else {
    ele.classList.remove('font-bold-row');
  }
}
