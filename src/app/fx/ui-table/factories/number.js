import { bindFontStyle, bindID, bindValue, bindFocus, bindPaste } from './utils';
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
import { eleFactory } from '../../../../shared/models/util';
import { pasteHook } from '../../../../shared/hooks/paste';
import { getNumber } from '../../services';


export function createNumber(input) {


  input.cell.value = getNumber(input.cell.value, input.cell.decimal);
  // input
  //   .scope
  //   .numberCellChange(input.tab, input.cell.colIndex);
  // input
  //   .scope
  //   .numberInit(input.cell);
  
  let ele = input.cell.ele.children[0];
  // ele.value = input.cell.value || 0;

  ele.addEventListener('change', () => {
    input.cell.value = ele.value;
    input.scope.exeFuncs(input.tab, input.cell, input.row.rowIndex, input.cell.colIndex);
    input.scope.$apply();
    window.changeflag = true;
  });

  input.cell.on(CELL_VALUE_CHANGED, () => {
    ele.value = input.cell.value;
  });
  bindID(input.tab, input.cell, input.row, ele, 'number');
  bindFocus(ele, input.cell, input.scope);
  
  ele.tabIndex = 100000 * (input.tabIndex + 1) + 100 * (input.rowIndex + 1) + input.index;
  ele.addEventListener('blur', () => {
    input.cell.validate && input
      .cell
      .validate();
    input
      .scope
      .numberCellChange(input.tab, input.cell.colIndex);
    input
      .scope
      .sumRowRefresh(input.tab);
    input
      .scope
      .$apply();
  });
  
  bindPaste(input, ele);
  // pasteHook(input.scope, input.tab, input.$dataTable, input.row, input.cell, ele);

  // return ele;
};