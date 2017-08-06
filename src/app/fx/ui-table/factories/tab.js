import { bindFontStyle, bindID, bindValue, bindFocus, bindBlur } from '../utils';
import { selectHook } from '../../../../shared/hooks/select';

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
  CELL_SELECTNAME_CHANGED,
  ROW_BEFORE_CELLS_CHANGED,
  ROW_CELLS_CHANGED,
  ROW_DEL_CHANGE,
  ROW_CHECKED,
  ROW_INDEX_CHANGE,
  ROW_REMOVED,
} from '../../../../shared/models';

export function createTab(input) {
  let ele = input.cell.ele.children[0];

  if (input.cell.href != '' && input.cell.href != '/') {
    ele.addEventListener('click', () => {
      input.scope.showDialog(input.cell, input.row);
      input.scope.$apply();
    });
  }
  // bindFontStyle(input.cell, ele);
  ele.innerText = input.row.data[input.cell.labelProperty];
  return ele;
}