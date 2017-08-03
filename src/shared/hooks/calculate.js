let rightMenuDiv = $(`
  <div class="calculate-panel" 
    style="z-index:10;text-align:center;min-width:80px;">
      <a href="javascript:;">重新计算</a>
  </div>
`).appendTo('body').hide();

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

    //获取计算公式及数值信息
    var rightMenu = function (e) {
      if (window.calculate_rightMenu) {
        $(window.calculate_rightMenu).remove();
        window.calculate_rightMenu = false;
      }

      rightMenuDiv
        .css({ 'left': e.pageX +30, 'top': e.pageY - 80 })
        .show()
        .insertAfter(ele)
        .find('a')
        .off('.rightMenuDiv')
        .on('click.rightMenuDiv',function () {
          rightMenuDiv.hide();
          window.calculate_rightMenu = false;
          reCalculate(tab.table.columns, cell, tab.table.tbody.rows, rowIndex, colIndex, tab, tabs);
        });
      window.calculate_rightMenu = rightMenuDiv;
      $(document).on('click', function (e) {
        if ($(e.target).is(rightMenuDiv) || rightMenuDiv.has($(e.target)).length > 0) {
          return;
        }
        rightMenuDiv.hide();
        window.calculate_rightMenu = false;
      });
    }
    var flag = null;
    $(ele).mouseover(function (e) {
      flag = true;
      $.debounce(() => {
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
          console.log(1);
        }
      }, 300);
    }).mouseout(function (e) {
      flag = false;
      if (calculateDiv) {
        calculateDiv.hide();
        console.log(2);
      }
    }).mousemove(function (e) {
      if (calculateDiv) {
        calculateDivRender({ 'left': e.pageX + 30, 'top': e.pageY - 80 });
        console.log(3);
      }
    }).mousedown(function (e) {
      if (3 == e.which) {
        window.calculate_rightevent = true;
        document.oncontextmenu = function () {
          if (window.calculate_rightevent) {
            window.calculate_rightevent = false;
            return false;//对IE 中断 默认点击右键事件处理函数
          } else {
            //e.preventDefault();//对标准DOM 中断 默认点击右键事件处理函数
            return true;
          };
        };
        rightMenu(e);
      }
    });
				
  }
}