export function deleteCommand(tab) {
  if (!tab.table.tbody) return;
  var selectedNoIdRows = [];
  var selectedRows = [];
  var canDel = true;
  tab.table.tbody.rows.forEach(row => {
    if (row.checked) {
      if (row.id) {
        selectedRows.push(row);
      } else {
        selectedNoIdRows.push(row);
      }
    }
  });
  if (selectedRowIndexs.length <= 0 && selectedNoIdRowIndexs.length <= 0) {
    setPrompt('请选中要删除的记录', false);
  } else {
    if (selectedRows.length > 0) {
      selectedRows.forEach(row => {
        row.del = true;
      });
    } else {
      selectedNoIdRows.forEach(row => {
        row.remove();
      });
    }
    // refreshGroup(tab);
    tab.table.tbody.scope.sumRowRefresh(tab);
    tab.table.tbody.scope.exeFuncs(tab);
  }
}