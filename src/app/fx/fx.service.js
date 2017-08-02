import { UICell, UIRow, UITable } from '../../shared/models';

angular.module('fx')
  .service('fxService', ['swordHttp', 'FxCellFactoryService', '$timeout', '$filter', 'CellCompilePoolService', function (swordHttp, CellFactoryService, $timeout, $filter, CellCompilePoolService) {
    
    function setData(uimodule, tab, uidata, scope) {
      var setDataStart = Date.now();
      if (uidata.label) {
        uimodule.label.value = uidata.label;
      }
      //tableWidth
      if (uidata.tableWidth) {
        tab.table.width = uidata.tableWidth
      }
      //filter
      if (tab.table && tab.table.filterProperty) {
        tab.table.filters = [];
      }
      //如果有设置表头，在此处理
      if (uidata && uidata.thead) {
        tab.table.thead = uidata.thead;
      }
      if (uidata && uidata.columns) {
        tab.table.columns = uidata.columns;
      }
      if (uidata && uidata.datas) {
        var rows = [];
        uidata.datas.forEach((rowdata, rowIndex, rowArr) => {
          var row = { rowIndex: rowIndex, cells: [], data: rowdata };
          row.cells = tab.table.columns.map((column, colIndex) => {
            var value;
            if (column.dynamic) {
              if (rowdata[column.dynamicGroup] && rowdata[column.dynamicGroup][column.colIndex]) {
                value = rowdata[column.dynamicGroup][column.colIndex][column.property];
              }
            } else {
              value = rowdata[column.property];
            }
            var cell = {};
            Object.assign(cell, column);
            cell.colIndex = colIndex;
            cell.value = value;
            //设置加粗字体
            cell.font = { bold: false };
            if (tab.table.fontBoldRows && tab.table.fontBoldRows.indexOf(rowIndex) >= 0) {
              cell.font.bold = true;
            }
            //处理filter
            if (column.property == tab.table.filterProperty) {
              if (tab.table.filters.indexOf(value) < 0) {
                tab.table.filters.push(value);
              }
            }
            if (!cell.hide && cell.group && rowIndex != 0) {
              //分组列
              var cellGroup = function (step) {
                if (value === rows[rowIndex - step].cells[colIndex].value) {
                  if (!rows[rowIndex - step].cells[colIndex].hide) {
                    rows[rowIndex - step].cells[colIndex].rowspan++;
                    cell.hide = true;
                  } else {
                    cellGroup(step + 1);
                  }
                }
              }
              cellGroup(1);
            } else if (cell.dataType == 'id') {
              row.id = value;
            }
            if (tab.table.disableRows) {
              for (var i = 0; i < tab.table.disableRows.length; i++) {
                if (tab.table.disableRows[i] == rowIndex && cell.dataType != 'label') {
                  cell.dataType = 'disable';
                  cell.value = '';
                }
              }
            }
            if (cell.dataType == 'text'
              || cell.dataType == 'textarea'
              || cell.dataType == 'select'
              || cell.dataType == 'datetime'
              || cell.dataType == 'number'
              || cell.dataType == 'label') {
              cell.validate = cellvalidate;
              if (cell.dataType == 'label') {
                cell.validate();
              }
            }
					
            return cell;
          });
          if (isNotNull(tab.table) && isNotNull(tab.table.filters)) {
            tab.table.filters.sort(function (a, b) { return b - a })
          }
          rows.push(row);
        });
        if (tab.table) {
          tab.table.tbody = { rows: rows };
          var startTime = new Date().getTime();
          tab.table.tbody = UITable.factory(tab.table.tbody, tab.id);
          console.log('table build time: ', new Date().getTime() - startTime);
        }
      }
      if (tab.table && tab.table.filterProperty && tab.table.filters.length > 0) {
        tab.table.filterChoose = tab.table.filters[0];
      }
      if (uidata && uidata.subDatas) {
        var rows = [];
        angular.forEach(uidata.subDatas, function (rowdata, rowIndex, rowArr) {
          var row = { rowIndex: rowIndex, cells: [] };
          angular.forEach(tab.subTable.columns, function (column, colIndex, colArr) {
            var value = rowdata[column.property];
            var cell = angular.copy(column);
            cell.colIndex = colIndex;
            cell.value = value;
            if (cell.dataType == 'id') {
              row.id = value;
            }
            row.cells[colIndex] = cell;
          });
          rows[rowIndex] = row;
        });
        if (isNotNull(tab.subTable)) {
          tab.subTable.tbody = { rows: rows };
        }
      }
      if (tab.table && tab.table.tbody) {
        var startTime = new Date().getTime();
      
        tab.table.tbody.append(`#main_table_${tab.id}`);
        console.log('table appending time: ', new Date().getTime() - startTime);
        
        $timeout(() => {
          var startTime = new Date().getTime();
          renderTable(tab, tab.table.tbody, scope, uimodule);
          console.log('table rendering time: ', new Date().getTime() - startTime);
        });
      }
      console.log('set data time:', Date.now() - setDataStart);
    }

    function renderTable(uitab, tbody, scope, uimodule) {
      tbody.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, colIndex) => {
          let func = () => new Promise((resolve) => {
            CellFactoryService.factory(row, cell, uitab, colIndex, rowIndex, uimodule.tabs.indexOf(uitab), scope);
            resolve();
          });
          CellCompilePoolService.createTask(func);
        });
      });
      CellCompilePoolService.startCompile(40).then(() => {
        tbody.rows.forEach((row, rowIndex) => {
          row.cells.forEach((cell, colIndex) => {
            scope.numberCellChange(uitab, cell.colIndex);
            scope.numberInit(cell);
          });
        });
        
        scope.$emit('ngRepeatFinished');
        scope.$apply();
      });
    }
    

    //失去焦点校验
    function cellvalidate(res) {
      var cell = this;
		
      if (cell.unit && cell.value) {
        cell.value = cell.value.toString().replaceAll(cell.unit, '');
      }
      cell.invalide = false;
      var result = res ? res : { succ: true, propertyName: cell.propertyName, msg: [] };
      var addMsg = function (msg) {
        cell.invalide = true;
        result.succ = false;
        if (result.msg.indexOf(msg) < 0) {
          result.msg.push(msg);
        }
      }
      if (cell.required && isNull(cell.value)) {
        addMsg('不能为空');
      }
      if (cell.minLength > 0 && (isNull(cell.value) || cell.value.toString().length < cell.minLength)) {
        addMsg('不能少于[' + cell.minLength + ']个字');
      }
      if (cell.maxLength && isNotNull(cell.value) && cell.value.toString().length > cell.maxLength) {
        addMsg('不能大于[' + cell.maxLength + ']个字');
      }
      var formatInvalide = false;
      if (cell.regexp && isNotNull(cell.value) && cell.value != '---'
        && ((cell.dataType != 'number' && !(new RegExp(cell.regexp)).test(cell.value.toString()))
          || (cell.dataType == 'number' && !(new RegExp(cell.regexp)).test(cell.value.toString().replaceAll(',', ''))))) {
        addMsg('格式错误');
        formatInvalide = true;
      }
      if (cell.dataType == 'number' && !formatInvalide && isNotNull(cell.value)) {
        if (isNotNull(cell) && isNotNull(cell.value)) {
          cell.value = cell.value.toString().replaceAll(',', '');
        }
        if (cell.min && parseFloat(cell.value.toString() < cell.min)) {
          addMsg('不能小于[' + cell.min + ']');
        }
        if (cell.max && parseFloat(cell.value.toString()) > cell.max) {
          addMsg('不能大于[' + cell.max + ']');
        }
        if (cell.decimal != undefined) {
          if (cell.decimal > 0 && cell.value.toString().indexOf('.') >= 0
            && cell.value.toString().substring(cell.value.toString().indexOf('.') + 1).length > cell.decimal) {
            addMsg('小数位数不能超过[' + cell.decimal + ']位');
          }
          if (cell.decimal > 0 && (cell.value.toString().indexOf('.') < 0
            || cell.value.toString().substring(cell.value.toString().indexOf('.') + 1).length < cell.decimal)) {
            var num;
            if (cell.value.toString().indexOf('.') < 0) {
              cell.value += '.';
              num = cell.decimal;
            } else {
              num = cell.decimal - cell.value.toString().substring(cell.value.toString().indexOf('.') + 1).length;
            }
            cell.value += '0'.repeat(num);
          }
				
          if (cell.decimal == 0 && cell.value.toString().indexOf('.') >= 0) {
            addMsg('不能为小数');
          }
        }
        cell.value = $filter('number')(cell.value, cell.decimal);
      }
      if (cell.unit && cell.value) {
        cell.value = cell.value + cell.unit;
      }
      return result;
    }

    return {
      setData,
      cellvalidate
    }
  }]);