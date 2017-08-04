import { bindFontStyle, bindID, bindFocus, bindBlur, bindValue, bindPaste, bindTabIndex } from '../utils';

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
import { contentEditable } from '../../../../shared/hooks/content-editable';

export function createTextarea(input) {
  let ele = input.cell.ele.children[0];

  input.cell.editable = true;

  bindID(input.tab, input.cell, input.row, ele, 'textarea');
  contentEditable(ele, (text) => {
    input.cell.setValue(text);
  });
  input.cell.on(CELL_VALUE_CHANGED, () => {
    ele.innerText = input.cell.value;
  });
  // bindTabIndex(input, ele);
  // bindPaste(input, ele);
  return ele;
}