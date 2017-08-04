let calculateDiv = $(`
  <div class="calculate-panel">
    <div class="calculate-desc"></div>
    <br/>
    <div class="checked-desc"></div>
  </div>
`).appendTo('body').hide();

let calculateDivRender = (style, calculateDesc, checkedDesc) => {
  calculateDesc && calculateDiv.find('.calculate-desc').html(calculateDesc);
  checkedDesc && calculateDiv.find('.checked-desc').html(checkedDesc);
  calculateDiv.css(style);
};


export function calculationHook(input, ele) {
  var tab = input.tab;
  var cell = input.cell;
  var row = input.row;
  var rowIndex = row.rowIndex;
  var tabs = input.scope.uimodule.tabs;
  var colIndex = input.index;
  let loadedFlag = false;
  let contentCache = {};
  

  //判断是否是计算公式的单元格
  if (isCalculate(tab.table.columns, cell, tab.table.tbody.rows, rowIndex, colIndex, tab, tabs)) {
    var flag = null;
    $(ele).mouseover(function (e) {
      flag = true;
      setTimeout(() => {
        if (!flag) return;
        contentCache['main_table_C0201-3 tbody'] = contentCache['main_table_C0201-3 tbody'] || $('#main_table_C0201-3 tbody')[0];
        contentCache['main_table_C0201-4 tbody'] = contentCache['main_table_C0201-4 tbody'] || $('#main_table_C0201-4 tbody')[0];
        contentCache['main_table_C0201-5 tbody'] = contentCache['main_table_C0201-5 tbody'] || $('#main_table_C0201-5 tbody')[0];
      
        if (contentCache['main_table_C0201-3 tbody']
          || contentCache['main_table_C0201-4 tbody']
          || contentCache['main_table_C0201-5 tbody']
        ) {
          var calculateDesc = getCalculate(tab.table.columns, cell, tab.table.tbody.rows, rowIndex, colIndex, tabs, tab);
          var checkedDesc = getCheckedMSG(tab.id, tabs, tab.table.tbody.rows[rowIndex].cells[0].value, cell.property);
          calculateDivRender({ 'left': e.pageX, 'top': e.pageY - 80 }, calculateDesc, checkedDesc);
          calculateDiv.insertAfter($(ele));
          calculateDiv.fadeIn(300);
        }
      }, 300);
    }).mouseout(function (e) {
      flag = false;
      if (calculateDiv) {
        calculateDiv.hide();
      }
    }).mousemove(function (e) {
      if (calculateDiv) {
        calculateDivRender({ 'left': e.pageX + 30, 'top': e.pageY - 80 });
      }
    });
				
  }
}