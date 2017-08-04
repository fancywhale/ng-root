import {
  bindFontStyle,
  bindID,
  bindValue,
  bindFocus,
  bindPaste,
  bindTabIndex,
} from '../utils';

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
import {
  pasteHook,
  calculationHook,
} from '../../../../shared/hooks';

import { getNumber } from '../../services';


export function createNumber(input) {

  let ele = input.cell.ele.children[0];
  // ele.value = input.cell.value || 0;

  input.cell.value = getNumber(input.cell.value);
  input.cell.editable = true;

  input.cell.on(CELL_VALUE_CHANGED, () => {
    ele.innerText = input.cell.value;
  });
  bindID(input.tab, input.cell, input.row, ele, 'number');
  bindFocus(ele, input.cell, input.scope);
  // bindTabIndex(input, ele);
  
  ele.addEventListener('blur', () => {
    input.cell.value = ele.innerText;
    try {
      input.scope.exeFuncs(input.tab, input.cell, input.row.rowIndex, input.cell.colIndex);
    } catch (e){
      console.log('exe func error');
    }
    input.cell.validate && input.cell.validate();
    input.scope.numberCellChange(input.tab, input.cell.colIndex);
    input.scope.sumRowRefresh(input.tab);
    input.scope.$apply();
    window.changeflag = true;
  });

  ele.addEventListener('keydown', (e) => {
    if (document.activeElement === ele && ele.contentEditable === 'true') {
      e.stopPropagation();
    }
  });

  ele.innerText = input.cell.value;
  calculationHook(input, ele);
  // bindPaste(input, ele);
  // pasteHook(input.scope, input.tab, input.$dataTable, input.row, input.cell, ele);

  // return ele;
};