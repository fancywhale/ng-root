import { bindFontStyle, bindID } from '../utils';
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
 * @desc 创建check类型
 * @param  {} row
 * @param  {} cell
 * @param  {} uitab
 * @param  {} index
 * @param  {} rowIndex
 */
export function createCheckBox(input) {

  let ele = input.cell.ele.children[0];

  ele.checked = input.row.checked;
  input.row.on(ROW_CHECKED, (value) => {
    ele.checked = value;
  });
  ele.addEventListener('change', () => {
    input.row.checked = ele.checked;
    input.scope.$apply();
  });
  return ele;
}