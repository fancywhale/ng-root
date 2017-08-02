import {
  checkIsNotEmptyDynamicHead,
  cellvalidate
} from '../utils';

export function addCommand(tab) {
  //验证表头
  if (!checkIsNotEmptyDynamicHead(tab)) {
    setPrompt('请先添加动态列信息', false);
    return;
  }
  //判断动态列是否有值，没有提示
  var flag = true;
  var row = { rowIndex: tab.table.tbody.rows.length, cells: [], data: {} };
  angular.forEach(tab.table.columns, function (column, colIndex, colArr) {
    var cell = angular.copy(column);
    row.data[column.property] = '';
    if (cell.dataType == 'select') {
      if (cell.options.length == 1) {
        setPrompt(cell.emptyOptionsMsg, false);
        flag = false;
      }
    }
    cell.colIndex = colIndex;
    cell.value = '';
    if (cell.dataType == 'href') {
      cell.dataType = 'text';
      cell.property = cell.labelProperty;
    } else if (cell.dataType == 'label') {
      cell.dataType = 'text';
    }
    if (cell.dataType == 'text'
      || cell.dataType == 'textarea'
      || cell.dataType == 'select'
      || cell.dataType == 'datetime'
      || cell.dataType == 'number'
      || cell.dataType == 'label') {
      cell.validate = cellvalidate;
    }
    if (tab.id == "B0304-3-5" && cell.property == "ssny") {
      if (isNull(tab.table.filterChoose) || tab.table.filters.length <= 0) {
        setPrompt("请先增加年份再增行录入数据", false);
        flag = false;
        return;
      } else {
        cell.value = tab.table.filterChoose;
        row.cells[colIndex] = cell;
      }
    } else {
      row.cells[colIndex] = cell;
    }
  });
  if (flag) {
    tab.table.tbody.addRow(row);
    //处理滚动条滚动到底部
    setTimeout(()=> {
      var h = $('#main_table_panel_' + tab.id).height();
      var th = $('#main_table_' + tab.id).height();
      $('#main_table_panel_' + tab.id).scrollTop(th - h + 35);
    }, 500);
  }
}