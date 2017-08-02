import { bindFontStyle, bindID, bindFocus } from '../utils';
import { datePicker } from '../../../../shared/hooks/date-picker';
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
import { pasteHook } from '../../../../shared/hooks/paste';


/**
 * create datetime
 * @param {element}  
 */
export function createDateTime(input) {
  let ele = input.cell.ele.children[0];

  datePicker(ele, false, input.cell.format, false, (value) => {
    input.cell.value = value;
  });
  bindFontStyle(ele);
  bindFocus(ele, input.cell, input.scope);
  bindTabIndex(input, ele);

  ele.addEventListener('blur', () => {
    if (input.cell.validate) {
      input.cell.validate()
    }
    input.scope.exeFuncs(input.tab);
  });

  pasteHook(input.scope, input.tab, input.$dataTable, input.row, input.cell, ele);
}
