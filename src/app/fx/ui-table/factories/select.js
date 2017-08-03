import { bindFontStyle, bindID, bindValue, bindFocus, bindBlur, bindTabIndex } from '../utils';
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

export function createSelect(input) {
  let ele = input.cell.ele.children[0];


  if (!input.cell.custom && !input.row.id) {
    bindFontStyle(input.cell, ele);
    bindValue(input.cell, ele, input.scope);
    bindFocus(ele, input.cell, input.scope);
    bindBlur(input.cell, ele, input.tab, input.scope);
    // bindTabIndex(input, ele);

    return ele;
  } else if ((input.cell.custom && !input.row.id) || input.cell.writeable) {
    bindBlur(input.cell, ele, input.tab, input.scope);
    bindID(input.tab, input.cell, input.row, ele, 'select');
    bindFontStyle(input.cell, ele);
    bindFocus(ele, input.cell, input.scope);
    // bindTabIndex(input, ele);

    selectHook(input.scope, $(ele), input.cell);
    input.cell.on(CELL_SELECTNAME_CHANGED, (value) => {
      ele.value = value;
    });
    ele.addEventListener('change', () => {
      input.cell.selectname = ele.value;
    });

    return ele;
  } else if (input.row.id && !input.cell.writeable) {
    return ele;
  } else {
    return null;
  }
}