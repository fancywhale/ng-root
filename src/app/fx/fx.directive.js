import { ScrollService } from './services/scroll.service';
import { checkIsNotEmptyDynamicHead, addCommand, deleteCommand } from './services';

angular.module('fx')
  .directive('cwhbbbfx', [() => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fx/fx.html',
      controller: ['$timeout', '$scope', 'cwhbbbService', 'swordHttp', 'ngDialog', '$filter', '$sce', '$interval', 'fxService', cwhbbbFxController]
    }
  }]);


function cwhbbbFxController($timeout, $scope, cwhbbbService, swordHttp, ngDialog, $filter, $sce, $interval, fxService) {
  $scope.getAuditParams = function () {
    return getAuditParams();
  }
  $scope.ui = {
    tabIndex: 0,
    Index: 0,
  }
  $scope.xmid = window.top.xmid;
  $scope.cjbddm = cjbddm;
  $scope.checkedMSG = new Array();
  $scope.loading = 0;
  
  //初始化UI
  var initUI = function () {
    $scope.loadMsg = "界面初始化...";
    cwhbbbService.initUI({ xmid: window.top.xmid, cjbddm: cjbddm }, function (uimodule) {
      $scope.uimodule = uimodule;
      if (uimodule.scripts && uimodule.scripts.length > 0) {
        $(uimodule.scripts).each(function (index, script) {
          $(document.body).append('<script src="' + script + '"></script>');
        });
      }
      initData();
    });
  }
  //执行配置的自定义脚本中的方法
  $scope.exeFuncs = function (uitab, uicell, rowIndex, colIndex) {
    window.changeflag = true;
    if (uitab.funcs && uitab.funcs.length > 0) {
      $(uitab.funcs).each(function (i, f) {
        if (window[f]) {
          window[f](uitab.table.columns, uitab.table.tbody.rows, uicell, rowIndex, colIndex, $scope.uimodule.tabs);
        }
      });
    }
  }
  //执行配置的自定义脚本中的方法
  $scope.validetehbs = function (uitab) {
    //		if(uitab.id == "C0201-3" || uitab.id == "C0201-4" || uitab.id == "C0201-5"){
    //		}
    validetehbsData(uitab, uitab.table.columns, uitab.table.tbody.rows, $scope.uimodule);
  }
  $scope.selectedTableFilter = function (table, filter) {
    if (table.filterChoose == filter) {
      return;
    }
    table.filterChoose = filter;
  }
  $scope.fxB0304_3_5 = {
    myCreateYear: ""
  };
  //为销售结构分析用例的B0304-3-5的表格增加年份
  $scope.createYear = function (uitab, id, e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      var year = $scope.fxB0304_3_5.myCreateYear;
      var reg = new RegExp("^\\d{4}$");
      var table = uitab.table;
      if (year == "") {
        uitab.showInput = false;
      } else if (!reg.test(year)) {
        setPrompt("请输入四位整数年份", false);
        $scope.fxB0304_3_5.myCreateYear = "";
      } else {
        if (table.filters.indexOf(year) < 0) {
          table.filters.push(year);
          $scope.fxB0304_3_5.myCreateYear = "";
          uitab.showInput = false;
          if (isNotNull(table) && isNotNull(table.filters)) {//年度排序
            table.filters.sort(function (a, b) { return b - a })
          }
          if (table && table.filterProperty && table.filters.length > 0) {
            table.filterChoose = year;
          }
        } else {
          setPrompt("输入的年份已存在", false);
          $scope.fxB0304_3_5.myCreateYear = "";
        }
      }
    }
  }
	
  //为销售结构分析用例的B0304-3-5的表格删除年份
  $scope.deleteYear = function (uitab, filter) {
    var table = uitab.table;
    var rows = table.tbody.rows;
    if (isNotNull(rows)) {
      for (var i = rows.length - 1; i >= 0; i--) {
        var data = rows[i].data;
        if (data.ssny == filter) {
          rows.remove(rows[i]);
        }
      }
    }
    table.filters.remove(filter);
    table.tbody.rows = rows;
    if (table.filterChoose == filter) {
      if (table && table.filterProperty && table.filters.length > 0) {
        table.filterChoose = table.filters[0];
      } else {
        table.filterChoose = "isEmpty";
      }
    }
  }
	
  //获得焦点事件
  $scope.inputFocus = function (cell) {
    if ($scope.uimodule.label && $scope.uimodule.label.dataType == 'datetime' && isNull($scope.uimodule.label.value)) {
      setPrompt('请选择资料属期', false);
      $('.ym-box').fadeIn(300);
    }
  }
  //	$('#zlsqinput').on('click', function(e) {
  //		e.stopPropagation();
  //	});
  $(document).on('click', function (e) {
    //		if ($(e.target).attr('id') == 'zlsqinput') {
    //			return;
    //		}
    var ids = ['addsqsrk', 'ymbox', 'ymbox_year', 'ymbox_year_sub', 'ymbox_year_center', 'ymbox_year_add', 'ymbox_month', 'zlsqinput'];
    if (ids.indexOf($(e.target).attr('id')) >= 0) {
      return;
    }
    $scope.$apply(function () {
      $('.ym-box').fadeOut(300);
    });
  });
  $(document).mousedown(function (e) {
    /*if(3 == e.which){
      document.oncontextmenu=function(){
        return false;//对IE 中断 默认点击右键事件处理函数
      };
    }*/
  });
  $scope.numberInit = function (cell) {
    if (isNotNull(cell.value)) {
      cell.value = $filter('number')(cell.value.toString().replaceAll(',', ''), cell.decimal);
    }
    if (cell.unit && isNotNull(cell.value)) {
      cell.value = cell.value + cell.unit;
    }
  }

  var refreshGroup = function (tab) {
    angular.forEach(tab.table.tbody.rows, function (row, rowIndex, rowArr) {
      if (!row.del && !row.hide) {
        angular.forEach(row.cells, function (cell, colIndex, colArr) {
          var value = cell.value;
          if (cell.group) {
            cell.hide = false;
            cell.rowspan = 1;
          }
          if (!cell.hide && cell.group && rowIndex != 0) {
            //						//分组列
            var cellGroup = function (step) {
              if ((rowIndex - step) < 0) {
                return;
              }
              if (value === tab.table.tbody.rows[rowIndex - step].cells[colIndex].value) {
								
                if (tab.table.tbody.rows[rowIndex - step].cells[colIndex].hide
                  || tab.table.tbody.rows[rowIndex - step].del == true
                  || tab.table.tbody.rows[rowIndex - step].hide == true) {
                  cellGroup(step + 1);
                } else {
                  tab.table.tbody.rows[rowIndex - step].cells[colIndex].rowspan++;
                  cell.hide = true;
                }
              }
            }
            cellGroup(1);
          }
        });
      }
    });
  }
  $scope.sumRowRefresh = function (uitab) {
		
    if (uitab.table && uitab.table.sumRow) {
      $(uitab.table.columns).each(function (colIndex, col) {
        if (!col.sumCol) {
          return true;//跳到下一列
        }
        $scope.numberCellChange(uitab, colIndex);
      });
    }
  }
  $scope.numberCellChange = function (uitab, colIndex) {
    if (uitab.table.sumRow && uitab.table.columns[colIndex].sumCol) {
      var sum = 0;
      angular.forEach(uitab.table.tbody.rows, function (row) {
        var cell = row.cells[colIndex];
        if (cell.validate) {
          var vres = cell.validate();
          if (vres.succ && isNotNull(cell.value)) {
            sum = floatAdd(sum, parseFloat(cell.value.toString().replaceAll(',', '')));
          }
        }
      });
      uitab.table.columns[colIndex].sum = sum;
      var colcell = uitab.table.columns[colIndex];
      if (colcell.decimal > 0 && (colcell.sum.toString().indexOf('.') < 0
        || colcell.sum.toString().substring(colcell.sum.toString().indexOf('.') + 1).length < colcell.decimal)) {
        var num;
        if (colcell.sum.toString().indexOf('.') < 0) {
          colcell.sum += '.';
          num = colcell.decimal;
        } else {
          num = colcell.decimal - colcell.sum.toString().substring(colcell.sum.toString().indexOf('.') + 1).length;
        }
        colcell.sum += '0'.repeat(num);
      }
      uitab.table.columns[colIndex].sum = $filter('number')(sum, uitab.table.columns[colIndex].decimal);
    }
  }
	
  //初始化数据
  var initData = function () {
    $scope.loadMsg = "数据加载中...";
    //遍历tab，分别加载各自的table数据
    var count = $scope.uimodule.tabs.length;
    var extend = new Array();
    var tabs = new Array();
    var cjbgdms = "";
    var tabMap = new Map();
    angular.forEach($scope.uimodule.tabs, function (tab) {
      cjbgdms = cjbgdms + tab.id + ",";
      tabMap.put(tab.id, tab);
    });
    //debugger;
    cjbgdms = cjbgdms.substring(0, cjbgdms.length - 1);
    var cjbgdmArr = cjbgdms.split(',');
    var loadSize = 2;
    var totalSize = cjbgdmArr.length;
    if (totalSize > loadSize) {
			
      var dataMap = new Map();
      let scrollService = new ScrollService(dataMap, cjbgdmArr);
			
      var loadHBData = function (uidataList) {
        $scope.loading--;
        $.each(uidataList, function (index, uidata) {
          var tabId = uidata.id;
          dataMap.put(tabId, uidata);
          var tab = tabMap.get(tabId);
          fxService.setData($scope.uimodule, tab, uidata, $scope);
          if (uidata.extend != null) {
            for (var extendIndex = 0; extendIndex < uidata.extend.checked.length; extendIndex++) {
              extend.push(uidata.extend.checked[extendIndex]);
            }
          }
        });
        if (loadIndex == cjbgdmArr.length - 2) {
          validetebgjjy($scope.uimodule.tabs);
          $('.new_function_menu').show();
          return;
        }
      }
			
      $('.new_function_menu').hide();
      let param = { xmid: window.top.xmid, cjbddm: cjbddm, cjbgdms: cjbgdmArr.slice(0, 2) };
      $scope.loading++;
      cwhbbbService.loadData(param, loadHBData);

      $scope.$on('ngRepeatFinished', () => {
        scrollService.stopLoading();
      });
        
      $(window).on('scroll', $.debounce(() => {
        console.log('scrolling', Date.now());
        if (scrollService.startLoading()) {
          let param = { xmid: window.top.xmid, cjbddm: cjbddm, cjbgdms: scrollService.bgdm };
          cwhbbbService.loadData(param, loadHBData);
          $scope.loading++;
          $scope.$apply();
        }
      }, 300));
    }
  }
  initUI();
	
  //初始化往期期限
  var initTimes = function () {
    var param = { xmid: window.top.xmid, bddm: cjbddm };
    cwhbbbService.queryPeriod(param, function (resp) {
      $scope.times = resp;
      if ($scope.times) {
        if (!$scope.checkedTime) {
          $scope.checkedTime = $scope.times[0];
        }
      }
    });
  }
  initTimes();
  
  //判断是否ie
  $scope.isIe = function () {
    return window.browser.versions.trident || window.browser.versions.webKit;
  }
  $scope.editmoduleKeyup = function (id, edithead, editheads, $event) {
    if (event.keyCode == 13) {
      $scope.editmodleOff(id, edithead, editheads);
    }
  }
  //公共
  $scope.exeCommand = function (button) {
    if ('exit' === button.action) {
      window.top.MainPage.closeTab();
    } else if ('viewCjmx' === button.action) {
      var viewCjmxUrl = '/sword?ctrl=XmXmcjmxglCtrl_initReadPage';
      window.top.MainPage.newTab('viewCjmx', '采集模型查看', 'icon-home', viewCjmxUrl, true);
    } else if ('save' === button.action) {
      if (window.changeflag == false) {
        setPrompt('没有修改，无需保存', true);
        return;
      }
      var param = { xmid: window.top.xmid, cjbddm: $scope.cjbddm, fjuuid: $scope.fjuuid };
      var cjbgs = [];
      if ($scope.uimodule.label) {
        if ($scope.uimodule.label.dataType == 'datetime') {
          param.jzrq = $scope.uimodule.label.value;
          if (!param.jzrq) {
            setPrompt("资料属期不能为空", false);
            return;
          }
        }
        if ($scope.uimodule.label.dataType == 'label') {
          if (!$scope.uimodule.label.value) {
            setPrompt('请导入模版数据', false);
            return;
          }
          param.jzrq = $scope.uimodule.label.value;
        }
      }
			
      var invalide = false, calculateErr = false;
      angular.forEach($scope.uimodule.tabs, function (tab, tabIndex) {
        if (!invalide) {
          var cjbg = { cjbgdm: tab.id };
          var cjmxs = [];
          if (tab.table && tab.table.tbody) {
            //一个表单的验证结果
            var validateResult = { succ: true, errors: {} };
            angular.forEach(tab.table.tbody.rows, function (row) {
              var cjmx = { cjmxdm: row.id, isdel: row.del ? true : false };
              angular.forEach(row.cells, function (cell, cellIndex) {
                if (invalide) {
                  $scope.uimodule.tabActiveIndex = tabIndex;
                }
                if (cell.validate && !row.del) {
                  var result = cell.validate(validateResult.errors[cell.property]);
                  if (!result.succ) {
                    validateResult.succ = false;
                    invalide = true;
                    validateResult.errors[cell.property] = result;
                  }
                }
                if (!row.del && cell.hbsEqualsFlag) {
                  calculateErr = true;
                }
                if (cell.dataType == 'text'
                  || cell.dataType == 'textarea'
                  || cell.dataType == 'select'
                  || cell.dataType == 'datetime'
                  || cell.dataType == 'number'
                  || cell.dataType == 'label') {
                  var value = cell.value;
                  if (cell.dataType == 'number' && value) {
                    value = value.toString().replaceAll(',', '');
                  }
                  if (cell.unit) {
                    value = value.toString().replaceAll(cell.unit, '');
                  }
                  if (cell.dynamic) {
                    if (cjmx[cell.dynamicGroup]) {
                      cjmx[cell.dynamicGroup][cell.colIndex] = {};
                      cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                      if (cell.hbsEqualsFlag) {
                        cjmx[cell.dynamicGroup][cell.colIndex][cell.property + '_calculateErr'] == 'true';
                      }
                    } else {
                      cjmx[cell.dynamicGroup] = [];
                      cjmx[cell.dynamicGroup][cell.colIndex] = {};
                      cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                      if (cell.hbsEqualsFlag) {
                        cjmx[cell.dynamicGroup][cell.colIndex][cell.property + '_calculateErr'] = 'true';
                      }
                    }
                  } else {
                    cjmx[cell.property] = value;
                    if (cell.dataType == 'select') {
                      cjmx[cell.property + '_zdy'] = cell.zdy;
                      if (tab.id == "A0101-1" || tab.id == "A0201-1" || tab.id == "A0201-4"
                        || tab.id == "A0201-5" || tab.id == "A0401-1" || tab.id == "A0501-1"
                        || tab.id == "B0301-1" || tab.id == "B0302-1" || tab.id == "B0303-1"
                        || tab.id == "B0304-1" || tab.id == "C0101-1" || tab.id == "C0102-1"
                        || tab.id == "C0201-2" || tab.id == "B0204-1" || tab.id == "C0205-1"
                        || tab.id == "C0206-1" || tab.id == "C0207-1" || tab.id == "C0208-1"
                        || tab.id == "C0209-1") {
                        cjmx["zbfldm"] = tab.table.tbody.rows[row.rowIndex].data.zbfl;
                        cjmx["zbflvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].value;
                        cjmx["selectvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].selectname;
                        if (cjmx["zbflvalue"] != cjmx["selectvalue"]) {
                          cjmx["zbflvalue"] = cjmx["selectvalue"];
                        }
                      }
                    }
                    if (cell.hbsEqualsFlag) {
                      cjmx[cell.property + '_calculateErr'] = 'true';
                    }
                  }
                }
									
              });
              cjmxs.push(cjmx);
            });
            if (!validateResult.succ) {
              //处理提示
              var errors = '';
              for (var k in validateResult.errors) {
                errors += validateResult.errors[k].propertyName + ':' + validateResult.errors[k].msg.join(',') + '<br>';
              }
              setPrompt(errors, false);
            }
          }
          cjbg.cjmxs = cjmxs;
          //					//验证表头
          //					if(!checkIsNotEmptyDynamicHead(tab)){
          //						alert('请先添加动态列信息');
          //						invalide = true;
          //					}
          //把头也塞里
          if (!invalide && tab.table) {
            var title = [];
            angular.forEach(tab.table.thead.headRows, function (hr, headRowIndex) {
              var hrv = [];
              angular.forEach(hr.headCells, function (cell) {
                if (headRowIndex == 0) {
                  if (!cell.value) {
                    invalide = true;
                    setPrompt(cell.propertyName + "不能为空", false);
                  } else if (cell.regexp && isNotNull(cell.value)
                    && !(new RegExp(cell.regexp)).test(cell.value.toString())) {
                    invalide = true;
                    setPrompt(cell.propertyName + "格式错误", false);
                  } else if (hrv.indexOf(cell.value) >= 0) {
                    invalide = true;
                    setPrompt(cell.propertyName + "不能重复", false);
                  }
                }
                hrv.push(cell.value);
              });
              title.push(hrv);
            });
            cjbg.title = title;
          }
          if (!invalide && tab.subTable) {
            var fjs = [];
            if (tab.subTable.tbody) {
              angular.forEach(tab.subTable.tbody.rows, function (row) {
                var fjuuid = { fjuuid: row.id };
                fjs.push(fjuuid);
              });
            }
            cjbg.fjs = fjs;
          }
          if ($scope.checkedMSG && $scope.checkedMSG.length >= 0) {
            cjbg.checked = $scope.checkedMSG;
          }
          cjbgs.push(cjbg);
        }
      });
      if (invalide) {
        return;
      }
      var saveaction = function () {
        //param.cjbgs=cjbgs;
        if (window.isRunningCommand == true) {
          return;
        }
        param.datas = angular.toJson(cjbgs);
        window.showMask();
        window.isRunningCommand = true;
        cwhbbbService.save(param, function (data) {
          window.hideMask();
          if (data.succ) {
            setPrompt('保存成功', true);
            window.changeflag = false;
            initData();
            initTimes();
            window.isRunningCommand = false;
          } else {
            setPrompt(data.msg, false);
          }
        }, function () {
          window.isRunningCommand = false;
          window.hideMask();
          setPrompt('保存失败', false);
        });
      }
      //			if($scope.checkedMSG!=null&&$scope.checkedMSG!=undefined&&$scope.checkedMSG!=''&&$scope.checkedMSG.length>0){
      //				window.confirm('提示','有未通过校验的页面数据项，是否继续保存？',function(){
      //					saveaction();
      //				});
      //			}else if(calculateErr||($scope.checkedMSG!=null&&$scope.checkedMSG!=undefined&&$scope.checkedMSG!=''&&$scope.checkedMSG.length>0)){
      //				window.confirm('提示','页面数据项有计算不平，是否继续保存？',function(){
      //					saveaction(); 
      //				});
      //			}else{
      //				saveaction();
      //			}
      saveaction();
    } else if ('switchEmptyRow' == button.action) {
      button.status = !button.status;
      button.label = button.status ? button.labelOn : button.labelOff;
      $($scope.uimodule.tabs).each(function (tabIndex, tab) {
        var checkPropertys = button.extend[tab.id];
        if (!checkPropertys) {
          return true;//continue
        }
        $(tab.table.tbody.rows).each(function (rowIndex, row) {
          if (button.status) {
            var emptyRow = true;
            $(row.cells).each(function (cellIndex, cell) {
              if (checkPropertys.indexOf(cell.property) >= 0
                && ((cell.dataType != 'number' && isNotNull(cell.value))
                  || (cell.dataType == 'number' && !/^(0|0.0+)$/.test(cell.value)))) {
                emptyRow = false;
                return false;//break each
              }
            });
            if (emptyRow) {
              row.hide = true;
            } else {
              row.hide = false;
            }
          } else {
            row.hide = false;
          }
        });
        refreshGroup(tab);
      });
    } else if ('chart' === button.action) {
      var tab = arguments[1];
      button.status = !button.status;
      button.label = button.status ? button.labelOff : button.labelOn;
      tab.chart.show = button.status;
      //window.top.MainPage.newTab('report_line_'+tab.id,'图表','icon-bar-chart','/sword?ctrl='+ctrl+'_report&bgdm='+tab.id,true);
    } else if ('add' === button.action) {
      addCommand(arguments[1]);
    } else if ('delete' === button.action) {
      deleteCommand(arguments[1]);
    } else if ('editcol' === button.action) {
      if ($scope.uimodule.label && $scope.uimodule.label.dataType == 'datetime' && isNull($scope.uimodule.label.value)) {
        setPrompt('请选择资料属期', false);
        $('.ym-box').fadeIn(300);
        return;
      }
      var tab = arguments[1];
      var editHeads = [];//编辑列
      var editHeadDescription = tab.table.thead.editHeadDescription;
      angular.forEach(tab.table.thead.headRows[0].headCells, function (headCell) {
        if (headCell.dataType == 'text') {
          var cell = angular.copy(headCell);
          cell.oldValue = cell.value;
          editHeads.push(cell);
        }
      });
      ngDialog.open({
        showClose: false,
        width: 400,
        template: 'app/fx/templates/editcol.html',
        className: 'ngdialog-theme-plain',
        controller: function ($scope) {
          $scope.description = editHeadDescription;
          $scope.editHeads = editHeads;
          $scope.del = function (index) {
            if ($scope.editHeads[index].oldValue) {
              $scope.editHeads[index].isdel = true;
            } else {
              $scope.editHeads.splice(index, 1);
            }
			    		
          }
          $scope.candel = function () {
            return true;
            //			    		if($scope.editHeads.length==1){
            //			    			return false;
            //			    		}else{
            //			    			var len=0;
            //			    			angular.forEach($scope.editHeads,function(head){
            //			    				if(!head.isdel){
            //			    					len++
            //			    				}
            //			    			});
            //			    			if(len==1){
            //			    				return false;
            //			    			}
            //			    			return true;
            //			    		}
          }
          $scope.checkRequired = function (head) {
            if (!head.value || (head.regexp && isNotNull(head.value)
              && !(new RegExp(head.regexp)).test(head.value.toString()))) {
              return {
                background: '#eff3f8'
              };
            } else {
              return {};
            }
          }
          $scope.add = function () {
            var newHead = angular.copy($scope.editHeads[0]);
            newHead.value = '';
            newHead.oldValue = '';
            newHead.isdel = false;
            $scope.editHeads.push(newHead);
          }
          $scope.ok = function () {
            //确认处理
            //验证
            var requiredErr = false;
            var formatErr = false;
            var columns = [];
            var tmp = [];
            var exists = false;
            angular.forEach($scope.editHeads, function (head) {
              if (!head.value) {
                requiredErr = true;
              }
              var col = {};
              col[head.property] = head.value;
              col.oldValue = head.oldValue;
              col.isdel = head.isdel;
              columns.push(col);
              if (tmp.indexOf(head.value) >= 0) {
                exists = true;
              } else {
                tmp.push(head.value);
              }
              tmp.push(head.value);
              if (head.regexp && isNotNull(head.value)
                && !(new RegExp(head.regexp)).test(head.value.toString())) {
                formatErr = true;
              }
            });
            var errmsg = '';
            if (requiredErr) {
              errmsg += $scope.editHeads[0].propertyName + '不能为空;';
            }
            if (formatErr) {
              errmsg += $scope.editHeads[0].propertyName + '格式不正确;';
            }
            if (exists) {
              errmsg += '不能重复';
            }
            if (formatErr || requiredErr || exists) {
              setPrompt(errmsg, false);
              return;
            } else {
              var param = { columns: angular.toJson(columns) };
              //请求后台
              var cjbg = { cjbgdm: tab.id };
              var cjmxs = [];
              if (tab.table && tab.table.tbody) {
                //保存表单信息
                angular.forEach(tab.table.tbody.rows, function (row) {
                  var cjmx = { cjmxdm: row.id, isdel: row.del ? true : false };
                  angular.forEach(row.cells, function (cell, cellIndex) {
                    if (cell.dataType == 'text'
                      || cell.dataType == 'textarea'
                      || cell.dataType == 'select'
                      || cell.dataType == 'datetime'
                      || cell.dataType == 'number'
                      || cell.dataType == 'label') {
                      var value = cell.value;
                      if (cell.dataType == 'number' && value) {
                        value = value.toString().replaceAll(',', '');
                      }
                      if (cell.unit) {
                        value = value.toString().replaceAll(cell.unit, '');
                      }
                      if (cell.dynamic) {
                        if (cjmx[cell.dynamicGroup]) {
                          cjmx[cell.dynamicGroup][cell.colIndex] = {};
                          cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                        } else {
                          cjmx[cell.dynamicGroup] = [];
                          cjmx[cell.dynamicGroup][cell.colIndex] = {};
                          cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                        }
                      } else {
                        cjmx[cell.property] = value;
                      }
                    }
                  });
                  cjmxs.push(cjmx);
                });
              }
              cjbg.cjmxs = cjmxs;
              //把头也塞里
              if (tab.table) {
                var title = [];
                angular.forEach(tab.table.thead.headRows, function (hr) {
                  var hrv = [];
                  angular.forEach(hr.headCells, function (cell) {
                    hrv.push(cell.value);
                  });
                  title.push(hrv);
                });
                cjbg.title = title;
              }
              if (tab.subTable) {
                var fjs = [];
                if (tab.subTable.tbody) {
                  angular.forEach(tab.subTable.tbody.rows, function (row) {
                    var fjuuid = { fjuuid: row.id };
                    fjs.push(fjuuid);
                  });
                }
                cjbg.fjs = fjs;
              }
              //param.cjbgs=cjbgs;
              param.datas = angular.toJson(cjbg);
              window.showMask();
              cwhbbbService.refreshColumn(param, function (uidata) {
                window.hideMask();
                fxService.setData($scope.uimodule, tab, uidata, $scope);
              }, function () {
                window.hideMask();
                setPrompt('编辑动态列失败', false);
              });
            }
            $scope.closeThisDialog(1);
          }
        }
      });
    } else if ('addFile' === button.action) {
      var tab = arguments[1];
      ngDialog.open({
        showClose: false,
        width: 1100,
        template: 'app/fx/templates/file-select-dialog.html',
        className: 'ngdialog-theme-plain',
        controller: function ($scope) {
          $scope.viewOneFile = function (fileuuid) {
            var url = "/ywpt/page/viewFILE.jsp?uuid=" + fileuuid;
            top.MainPage.closeTab("menu_ckwj");
            window.top.MainPage.newTab('menu_ckwj', '查看', 'icon-home', url, true);
          }
          var fjuuids = [];
          if (tab.subTable.tbody) {
            angular.forEach(tab.subTable.tbody.rows, function (row) {
              fjuuids.push(row.id);
            });
          }
          var checkFj = function (fjuuid) {
            return fjuuids.indexOf(fjuuid) >= 0;
          }
          $scope.tabs = [{ cjbddms: ['10101', '10102'], files: [], loading: true },
          { cjbddms: ['10201', '10202'], files: [], loading: true },
          { cjbddms: ['10301', '10302'], files: [], loading: true },
          { cjbddms: ['10103'], files: [], loading: true }];
          angular.forEach($scope.tabs, function (tab) {
            cwhbbbService.queryXmFiles({ xmid: window.top.xmid, cjbddms: angular.toJson(tab.cjbddms) }, function (data) {
              tab.files = data;
              var lastCjmxflmc, lastZlmc, lastIndex1, lastIndex2, rowspan1 = 1, rowspan2 = 1;
              angular.forEach(tab.files, function (file, index) {
                file.checked = checkFj(file.uuid);
                file.rowspan = 1;
                file.cjmxflmcShow = true;
                file.cjmxmcShow = true;
                if (index == 0 || file.cjmxflmc != lastCjmxflmc) {
                  file.cjmxflmcShow = true;
                  file.cjmxmcShow = true;
                  lastIndex1 = index;
                  lastIndex2 = index;
                  lastCjmxflmc = file.cjmxflmc;
                  lastZlmc = file.cjmxmc;
                  rowspan1 = 1;
                  file.rowspan1 = 1;
                  rowspan2 = 1;
                  file.rowspan2 = 1;
                } else {
                  if (file.cjmxflmc == lastCjmxflmc) {
                    file.cjmxflmcShow = false;
                    tab.files[lastIndex1].rowspan1++;
                    if (file.cjmxmc == lastZlmc) {
                      file.cjmxmcShow = false;
                      tab.files[lastIndex2].rowspan2++;
                    } else {
                      lastIndex2 = index;
                      file.rowspan2 = 1;
                      lastZlmc = file.cjmxmc;
                      file.cjmxmcShow = true;
                    }
                  }
                }
              });
              tab.loading = false;
            }, function () {
              setPrompt('加载文件列表失败', false);
            });
          });
          $scope.hasCheckedFile = function () {
            var has = false;
            angular.forEach($scope.tabs, function (tab) {
              angular.forEach(tab.files, function (file) {
                if (file.checked) {
                  has = true;
                }
              });
            });
            return has;
          }
          $scope.selectedFile = function () {
            if (!tab.subTable.tbody) {
              tab.subTable.tbody = { rows: [] };
            }
            angular.forEach($scope.tabs, function (ftab) {
              angular.forEach(ftab.files, function (file) {
                if (file.checked) {
                  var has = false;
                  angular.forEach(tab.subTable.tbody.rows, function (row) {
                    if (row.id == file.uuid) {
                      has = true;
                    }
                  });
                  if (!has) {
                    var row = { id: file.uuid, cells: [] };
                    angular.forEach(tab.subTable.columns, function (cell) {
                      var newCell = angular.copy(cell);
                      newCell.value = file[newCell.property];
                      row.cells.push(newCell);
                    });
                    tab.subTable.tbody.rows.push(row);
                    window.changeflag = true;
                    changflag = true;
                  }
                }
              });
            });
            $scope.closeThisDialog(1);
          }
        }
      });
    } else if ('delFile' === button.action) {
      var tab = arguments[1];
      var selectedIndexs = [];
      if (isNotNull(tab.subTable.tbody)) {
        angular.forEach(tab.subTable.tbody.rows, function (row, index) {
          if (row.checked) {
            selectedIndexs.push(index);
          }
        });
      }
      if (selectedIndexs.length <= 0) {
        setPrompt('请选择要删除的附件', false);
        return;
      } else {
        for (var i = selectedIndexs.length - 1; i >= 0; i--) {
          tab.subTable.tbody.rows.splice(selectedIndexs[i], 1);
        }
        window.changeflag = true;
        changflag = true;
      }
    } else if ('loadFile' === button.action) {
      var uimodule = $scope.uimodule;
      var pageScope = $scope;
      window.showMask();
      cwhbbbService.getLoadFiles({ xmid: window.top.xmid, cjbddm: cjbddm }, function (data) {
        var files = data;
        window.hideMask();
        if (files.length <= 0) {
          setPrompt('该分析对应的采集文件尚未提交', false);
          return;
        }
        showDialog(files);
      }, function () {
        setPrompt('加载文件列表失败', false);
      });
      var showDialog = function (files) {
        ngDialog.open({
          showClose: false,
          width: 1100,
          template: 'app/fx/templates/load-file-dialog.html',
          className: 'ngdialog-theme-plain',
          controller: function ($scope) {
            $scope.files = files;
            $scope.selectedFile = function (uuid) {
              if (!$scope.seluuid || $scope.seluuid != uuid) {
                $scope.seluuid = uuid;
              } else {
                $scope.seluuid = false;
              }
            }
            $scope.loadFile = function () {
              window.showMask();
              cwhbbbService.loadFile({ xmid: window.top.xmid, cjbddm: cjbddm, fileUuid: $scope.seluuid }, function (data) {
                pageScope.fjuuid = $scope.seluuid;
                //$scope.files = data;
                var count = data.length;
                var extend = new Array();
                angular.forEach(data, function (d) {
                  count--;
                  angular.forEach(uimodule.tabs, function (tab) {
                    if (tab.id == d.id) {
                      fxService.setData($scope.uimodule, tab, d, $scope);
                      window.changeflag = true;
                      changflag = true;
                      if (d.extend != null) {
                        for (var extendIndex = 0; extendIndex < d.extend.checked.length; extendIndex++) {
                          extend.push(d.extend.checked[extendIndex]);
                        }
                      }
                    }
                  });
                  if (count == 0) {
                    validetebgjjy(uimodule.tabs);
                    console.log(3334555);
                    $scope.checkedMSG = checkedField(uimodule.tabs, extend);
                  }
                });
                pageScope.checkedTime = '';
                window.hideMask();
              }, function () {
                setPrompt('加载文件数据失败', false);
              });
              $scope.closeThisDialog(1);
            }
          }
        });
      }
    } else if ('invalid' === button.action) {
      var tab = null;
      if (isNotNull($scope.uimodule.tabs) && $scope.uimodule.tabs.length > 0) {
        tab = $scope.uimodule.tabs[0];
        var fxbddm = "";
        if (isNotNull(tab)) {
          var id = tab.id;
          fxbddm = id.substring(0, id.indexOf("-"));
        }
        var message = "请确认是否作废当前属期数据";
        window.confirm('提示', '请确认是否作废当前属期数据?', function () {
          var viewData = { fxbddm: fxbddm, bbrqz: time };
          var url = "/ajax.sword?ctrl=FxGyCtrl_deleteSqData";
          $scope.times.splice($scope.times.indexOf($scope.checkedTime), 1);
          $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: viewData,
            success: function (data) {
              //作废成功回调
              if (data.success) {
                setPrompt("作废当期数据成功", true);
                $scope.uimodule.label.value = $scope.times.length > 0 ? $scope.times[0] : null;
                $scope.checkedTime = $scope.times.length > 0 ? $scope.times[0] : null;
                $scope.loadZlsqData($scope.checkedTime);
                //								 alert("作废当期数据成功");
                //								 initData();
                //								 initTimes();
              }
            }
          });
        });
      }
    }
  }
  $scope.viewOneFile = function (fileuuid) {
    var url = "/ywpt/page/viewFILE.jsp?uuid=" + fileuuid;
    top.MainPage.closeTab("menu_ckwj");
    window.top.MainPage.newTab('menu_ckwj', '查看', 'icon-home', url, true);
  }
  //查看file
  $scope.viewFile = function (cjmxdm) {
    var url = "/ywpt/page/viewFILE.jsp?xmid=" + window.top.xmid + "&cjmxdm=" + cjmxdm;
    top.MainPage.closeTab("menu_ckwj");
    window.top.MainPage.newTab('menu_ckwj', '查看', 'icon-home', url, true);
  }
  //删除file
  $scope.delFile = function (cjmxdm, cell) {
    var param = { xmid: window.top.xmid, cjmxdm: cjmxdm };
    ngDialog.open({
      showClose: false,
      width: 1000,
      template: 'app/fx/templates/file-dialog.html',
      className: 'ngdialog-theme-plain',
      controller: function ($scope) {
        cwhbbbService.getFileList(param, function (data) {
          $scope.files = data;
        }, function () {
          setPrompt('加载附件列表失败', false);
        });
		    	
        $scope.delFile = function () {
          var uuids = '';
          var count = 0;
          angular.forEach($scope.files, function (file) {
            if (file.checked) {
              uuids += ',' + file.uuid;
              count++;
            }
          });
          if (uuids.length == 0) {
            setPrompt('请选中要删除的文件', false);
            return;
          }
          cwhbbbService.delFiles({ uuids: uuids.substring(1) }, function (data) {
            if (data.succ) {
              setPrompt('删除成功', true);
              $scope.closeThisDialog(1);
              if (count == $scope.files.length) {
                cell.value = false;
              }
            } else {
              setPrompt(data.msg, false);
            }
          }, function () {
            setPrompt('删除失败', false);
          });
		    		
        }
      }
    });
		
  }
  //拼链接方法
  $scope.getHref = function (href, params) {
    //暂时支持带问好并且带参数的和不带问号的，params 必须a=1&b=2这种格式
    var url = href;
    if (href.indexOf('?') < 0) {
      url += '?1=1';
    }
    return url + '&' + params;
  }
  //文件获取
  $scope.fileSelect = function (cjmxdm) {
		
  }
  //作废当前属期
  $scope.deleteSqData = function (time) {
    var tab = null;
    if (isNotNull($scope.uimodule.tabs) && $scope.uimodule.tabs.length > 0) {
      tab = $scope.uimodule.tabs[0];
      var fxbddm = "";
      if (isNotNull(tab)) {
        var id = tab.id;
        fxbddm = id.substring(0, id.indexOf("-"));
      }
      window.confirm('提示', '请确认是否作废当前属期数据?', function () {
        var viewData = { fxbddm: fxbddm, bbrqz: time };
        var url = "/ajax.sword?ctrl=FxGyCtrl_deleteSqData";
        $scope.times.splice($scope.times.indexOf($scope.checkedTime), 1);
        $.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          data: viewData,
          success: function (data) {
            //作废成功回调
            if (data.success) {
              setPrompt("作废当期数据成功", true);
              $scope.uimodule.label.value = $scope.times.length > 0 ? $scope.times[0] : null;
              $scope.checkedTime = $scope.times.length > 0 ? $scope.times[0] : null;
              $scope.loadZlsqData($scope.checkedTime);
              //							 alert("作废当期数据成功");
              //							 initData();
              //							 initTimes();
            }
          }
        });
      });
    }
  }
	
  $scope.getPageOfficeHeight = function () {
    var height = $(window).height();
    if (isNotNull($scope.uimodule) && $scope.uimodule.tabs && $scope.uimodule.tabs.length > 1) {
      height = height - 26;
    }
    console.log(height);
    if (height < 400) {
      return 400;
    } else {
      return height;
    }
  }
  //设置iframe高度$scope.setPageOfficeHeight
  window.onresize = function () {
    $scope.$apply(function () {
      $scope.getPageOfficeHeight();
    });
  }
	
  //div实现自动换行
  $scope.getTextareaDivText = function (value) {
    if (value) {
      return $sce.trustAsHtml(value.replace(/\n/g, "<br/>"));
    } else {
      return "";
    }
  }
	
  //文本域编辑框
  $scope.editTextArea = function (cell) {
    if (cell.dataType !== 'textarea') {
      return;
    }
    if (cell.height != 16) {
      return;
    }
    if (!cell.showDialog) {
      return;
    }
    ngDialog.open({
      showClose: false,
      width: 800,
      template: 'app/fx/templates/textarea-dialog.html',
      className: 'ngdialog-theme-plain',
      controller: function ($scope) {
        //		    	$scope.shouldBeOpen = true;
        $scope.description = angular.copy(cell.value);
        $scope.save = function () {
          cell.value = angular.copy($scope.description);
          window.changeflag = true;
          cell.validate();
          $scope.closeThisDialog(1);
        }
      }
    });
  }
	
  $scope.slideToggle = function () {
    $(".function_click_icon").toggleClass("function_menu_click");
    $(".font-awesome-icon").toggleClass("icon-th-large").toggleClass("icon-remove");
    $(".function_menu_list").slideToggle("quick");
  }
  $scope.initDrag = function () {
    //init position right down corn
    $(".new_function_menu").css("right", "1px");
    $(".new_function_menu").css("bottom", "40%");
    //setTimeout('$(".new_function_menu").css("width",$(".new_function_menu").width())',100);//set fix width to prevent drag slide width change
    //setTimeout('autoTextarea()',1000);//set fix width to prevent drag slide width change
    $(".new_function_menu").draggable({
      containment: "body",
      handle: ".function_menu_click_move",
      start: function () {
        $(".new_function_menu").css("right", "");
        $(".new_function_menu").css("bottom", "");
      },
      stop: function () {
        var right = $(window).width() - $(".new_function_menu").position().left - $(".new_function_menu").width();
        var bottom = $(window).height() - $(".new_function_menu").position().top - $(".new_function_menu").height();
        if (bottom <= 0) bottom = 0; //按钮不允许超出下边界
        $(".new_function_menu").css("left", "");
        $(".new_function_menu").css("top", "");
        $(".new_function_menu").css("right", right + "px");
        $(".new_function_menu").css("bottom", bottom);
        $(".new_function_menu").css("width", '180px');
      }
    });
  }
  $scope.regHotKey = function (uibuttion) {
    var hotKey = uibuttion.hotKey;
    if (!hotKey) {
      return;
    }
    var hdx = hotKey.indexOf("+");
    var key1 = hotKey.substring(0, hdx).toLowerCase();
    var key2 = hotKey.substring(hdx + 1, hotKey.length);
    var ctrlKey = false;
    var altKey = false;
    var shiftKey = false;
    if (key1 == "ctrl") {
      ctrlKey = true;
    } else if (key1 == "alt") {
      altKey = true;
    } else if (key1 == "shift") {
      shiftKey = true;
    }
    $(document).bind("keydown", function (event) {
      var m = String.fromCharCode(event.keyCode);
      if (event.ctrlKey == ctrlKey && event.altKey == altKey && event.shiftKey == shiftKey && m == key2) {
        $(document).find('#hidden_focus_hotKey').focus();
        $scope.exeCommand(uibuttion);
        event.preventDefault();
      }
    });
  }
	
	
  /**
   * 新的编辑动态列方法
   */
  $scope.editmodleCache = new Array();
  $scope.editmodleOn = function (id, edithead) {
    for (var i = 0; i < $scope.editmodleCache.length; i++) {
      var cache = $scope.editmodleCache[i];
      if (cache.id == id) {
        $scope.editmodleCache.splice(i--, 1);
      }
    }
    $scope.editmodleCache.push({
      id: id,
      value: edithead.value,
    });
    window.setTimeout("$('#" + id + "').focus();", 50);
  }
  $scope.editmodleOff = function (id, edithead, editheads) {
    if (!edithead.value || (edithead.regexp && isNotNull(edithead.value)
      && !(new RegExp(edithead.regexp)).test(edithead.value.toString()))) {
      $($scope.editmodleCache).each(function (index, cache) {
        if (cache.id == id) {
          edithead.value = cache.value;
          setPrompt(edithead.propertyName + '格式错误', false);
          //					window.setTimeout("$('#"+id+"').focus();", 50);
          return 0;
        }
      });
    } else {
      var pass = true;
      $(editheads).each(function (index, head) {
        if (id != (head.property + index) && edithead.value == head.value) {
          $($scope.editmodleCache).each(function (i, cache) {
            if (cache.id == id) {
              edithead.value = cache.value;
              setPrompt(edithead.propertyName + '不能重复', false);
              pass = false;
              //							window.setTimeout("$('#"+id+"').focus();", 50);
              return 0;
            }
          });
        }
      });
      if (pass) {
        edithead.editmodle = !edithead.editmodle;
      }
    }
  }
  $scope.editcolumn = function (uiheadcell, $event, index) {
    uiheadcell.editmodle = !uiheadcell.editmodle;
    $event.target.parentNode.parentNode.parentNode.className = "ng-scope";
    $scope.editmodleOn(uiheadcell.property + index, uiheadcell);
  }
  $scope.addcolumn = function (addHead, table, index) {
    var addHeadRows = new Array();
    //对表头与复杂表头计数
    var headCounts = new Array();
    $(table.thead.headRows).each(function (rowIndex, row) {
      headCounts.push({
        rowIndex: rowIndex,
        count: 0,
        begin: row.headCells.length,
      });
      $(row.headCells).each(function (cellIndex, cell) {
        if (rowIndex == 0 && cell.property == addHead.property) {
          headCounts[rowIndex].count++;
          if (cellIndex < headCounts[rowIndex].begin) {
            headCounts[rowIndex].begin = cellIndex;
          }
        } else if (cell.dynamic && cell.dynamicGroup == addHead.property) {
          headCounts[rowIndex].count++;
          if (cellIndex < headCounts[rowIndex].begin) {
            headCounts[rowIndex].begin = cellIndex;
          }
        }
      });
    });
    //复制表头
    var length = headCounts[0].count;
    var order = index - headCounts[0].begin;
    $(headCounts).each(function (countIndex, count) {
      count.count = count.count / length;
      for (var i = 0; i < count.count; i++) {
        addHeadRows.push({
          rowIndex: count.rowIndex,
          cellIndex: order * count.count + count.begin + count.count + i,
          cell: angular.copy(table.thead.headRows[count.rowIndex].headCells[order * count.count + count.begin + i]),
        });
        if (count.rowIndex == 0) {
          addHeadRows[addHeadRows.length - 1].cell.value = null;
          addHeadRows[addHeadRows.length - 1].cell.colIndex = addHeadRows[addHeadRows.length - 1].cell.colIndex + count.count;
          addHeadRows[addHeadRows.length - 1].cell.editmodle = true;
        }
      }
    });
		
    //表格计数
    var addColumns = new Array();
    var bodyCounts = new Array();
    $(table.tbody.rows).each(function (rowIndex, row) {
      bodyCounts.push({
        rowIndex: rowIndex,
        count: 0,
        begin: row.cells.length,
      });
      $(row.cells).each(function (cellIndex, cell) {
        if (cell.dynamic && cell.dynamicGroup == addHead.property) {
          bodyCounts[rowIndex].count++;
          if (cellIndex < bodyCounts[rowIndex].begin) {
            bodyCounts[rowIndex].begin = cellIndex;
          }
        }
      });
    });
    //复制表格
    $(bodyCounts).each(function (countIndex, count) {
      count.count = count.count / length;
      for (var i = 0; i < count.count; i++) {
        addColumns.push({
          rowIndex: count.rowIndex,
          cellIndex: order * count.count + count.begin + count.count + i,
          cell: angular.copy(table.tbody.rows[count.rowIndex].cells[order * count.count + count.begin + i]),
        });
        addColumns[addColumns.length - 1].cell.value = addColumns[addColumns.length - 1].cell.value == '---' ? '---' : '0.00';
        addColumns[addColumns.length - 1].cell.colIndex = addColumns[addColumns.length - 1].cell.colIndex + count.count;
      }
    });
		
    //粘贴单元格
    $(addHeadRows).each(function (index, headRow) {
      var cell = headRow.cell;
      var rowIndex = headRow.rowIndex;
      var cellIndex = headRow.cellIndex;
      table.thead.headRows[rowIndex].headCells.splice(cellIndex, 0, cell);
      for (var i = cellIndex + 1; i < table.thead.headRows[rowIndex].headCells.length; i++) {
        table.thead.headRows[rowIndex].headCells[i].colIndex = table.thead.headRows[rowIndex].headCells[i].colIndex + 1;
      }
    });
    $(addColumns).each(function (index, column) {
      var cell = column.cell;
      var rowIndex = column.rowIndex;
      var cellIndex = column.cellIndex;
      table.tbody.rows[rowIndex].cells.splice(cellIndex, 0, cell);
      for (var i = cellIndex + 1; i < table.tbody.rows[rowIndex].cells.length; i++) {
        table.tbody.rows[rowIndex].cells[i].colIndex = table.tbody.rows[rowIndex].cells[i].colIndex + 1;
      }
    });
		
    //处理合计行
    //合计行计数
    var sumCount = 0;
    var sumBegin = table.columns.length;
    var sumColumns = new Array();
    $(table.columns).each(function (colIndex, column) {
      if (column.dynamic && column.dynamicGroup == addHead.property) {
        sumCount++;
        if (colIndex < sumBegin) {
          sumBegin = colIndex;
        }
      }
    });
    //复制合计行
    sumCount = sumCount / length;
    for (var i = 0; i < sumCount; i++) {
      sumColumns.push({
        cellIndex: order * sumCount + sumBegin + sumCount + i,
        cell: angular.copy(table.columns[order * sumCount + sumBegin + i]),
      });
      sumColumns[sumColumns.length - 1].cell.value = null;
    }
    $(sumColumns).each(function (colIndex, column) {
      var cell = column.cell;
      var cellIndex = column.cellIndex;
      table.columns.splice(cellIndex, 0, cell);
      for (var i = cellIndex + 1; i < table.columns.length; i++) {
        table.columns[i].colIndex = table.columns[i].colIndex + 1;
      }
    });
	
		
    var count = headCounts[headCounts.length - 1].count;
    table.width = (table.width ? table.width : 1300) + count * 80;
    window.setTimeout("$('#" + addHead.property + (index + 1) + "').focus();", 50);
  }
	
  $scope.delcolumn = function (addHead, table, index) {
    var addHeadRows = new Array();
    //对表头与复杂表头计数
    var headCounts = new Array();
    $(table.thead.headRows).each(function (rowIndex, row) {
      headCounts.push({
        rowIndex: rowIndex,
        count: 0,
        begin: row.headCells.length,
      });
      $(row.headCells).each(function (cellIndex, cell) {
        if (rowIndex == 0 && cell.property == addHead.property) {
          headCounts[rowIndex].count++;
          if (cellIndex < headCounts[rowIndex].begin) {
            headCounts[rowIndex].begin = cellIndex;
          }
        } else if (cell.dynamic && cell.dynamicGroup == addHead.property) {
          headCounts[rowIndex].count++;
          if (cellIndex < headCounts[rowIndex].begin) {
            headCounts[rowIndex].begin = cellIndex;
          }
        }
      });
    });
    //复制表头
    var length = headCounts[0].count;
    if (length <= 1) {
      return;
    }
    var order = index - headCounts[0].begin;
    $(headCounts).each(function (countIndex, count) {
      count.count = count.count / length;
      for (var i = 0; i < count.count; i++) {
        addHeadRows.push({
          rowIndex: count.rowIndex,
          cellIndex: order * count.count + count.begin + i,
        });
      }
    });
		
    //表格计数
    var addColumns = new Array();
    var bodyCounts = new Array();
    $(table.tbody.rows).each(function (rowIndex, row) {
      bodyCounts.push({
        rowIndex: rowIndex,
        count: 0,
        begin: row.cells.length,
      });
      $(row.cells).each(function (cellIndex, cell) {
        if (cell.dynamic && cell.dynamicGroup == addHead.property) {
          bodyCounts[rowIndex].count++;
          if (cellIndex < bodyCounts[rowIndex].begin) {
            bodyCounts[rowIndex].begin = cellIndex;
          }
        }
      });
    });
    //复制表格
    $(bodyCounts).each(function (countIndex, count) {
      count.count = count.count / length;
      for (var i = 0; i < count.count; i++) {
        addColumns.push({
          rowIndex: count.rowIndex,
          cellIndex: order * count.count + count.begin + i,
        });
      }
    });
    addHeadRows.sort(function (row1, row2) {
      return row2.cellIndex - row1.cellIndex;
    });
    addColumns.sort(function (row1, row2) {
      return row2.cellIndex - row1.cellIndex;
    });
    //粘贴单元格
    $(addHeadRows).each(function (index, headRow) {
      var rowIndex = headRow.rowIndex;
      var cellIndex = headRow.cellIndex;
      table.thead.headRows[rowIndex].headCells.splice(cellIndex, 1);
    });
    $(addColumns).each(function (index, column) {
      var rowIndex = column.rowIndex;
      var cellIndex = column.cellIndex;
      table.tbody.rows[rowIndex].cells.splice(cellIndex, 1);
    });
		
    //处理合计行

    //合计行计数
    var sumCount = 0;
    var sumBegin = table.columns.length;
    var sumColumns = new Array();
    $(table.columns).each(function (colIndex, column) {
      if (column.dynamic && column.dynamicGroup == addHead.property) {
        sumCount++;
        if (colIndex < sumBegin) {
          sumBegin = colIndex;
        }
      }
    });
    //复制合计行
    sumCount = sumCount / length;
    for (var i = 0; i < sumCount; i++) {
      sumColumns.push({
        cellIndex: order * sumCount + sumBegin + i,
      });
    }
    sumColumns.sort(function (row1, row2) {
      return row2.cellIndex - row1.cellIndex;
    });
    $(sumColumns).each(function (colIndex, column) {
      var cellIndex = column.cellIndex;
      table.columns.splice(cellIndex, 1);
    });
	
    var count = headCounts[headCounts.length - 1].count;
    table.width = (table.width ? table.width : 1300) - count * 80;
  }
  $scope.countDynamic = function (headCells) {
    var count = 0;
    $(headCells).each(function (index, head) {
      if ((head.dynamic || head.dynamic == 'true') && head.dynamic != 'false') {
        count++;
      }
    });
    return count;
  }
	
  /**
   * 添加暑期
   */
  var addTime = function (ym) {
    $scope.times.push(ym);
    window.changeflag = true;
  }
  var caniclickthemonth = false;
  var initYearMonthPicker = function () {
    $('.ym-box>.year>.center').html($scope.uimodule.label.value ? $scope.uimodule.label.value.substring(0, 4) : new Date().getYear());
    $('.ym-box>.year>.left').click(function () {
      var year = $('.ym-box>.year>.center').html();
      $('.ym-box>.year>.center').html(parseInt(year) - 1);
    });
    $('.ym-box>.year>.right').click(function () {
      var year = $('.ym-box>.year>.center').html();
      $('.ym-box>.year>.center').html(parseInt(year) + 1);
    });
    $('.ym-box>.month>span').click(function () {
      if (caniclickthemonth) {
        caniclickthemonth = false;
        var y = $('.ym-box>.year>.center').html();
        var m = $(this).attr('month');
        if ($scope.times.indexOf(y + '-' + m) >= 0) {
          setPrompt('所选属期已存在', false);
          $scope.uimodule.label.value = y + '-' + m;
          $scope.checkedTime = y + '-' + m
          $('.ym-box').fadeOut(100);
          $scope.loadZlsqData(y + '-' + m);
        } else {
          $scope.uimodule.label.value = y + '-' + m;
          $scope.checkedTime = y + '-' + m
          $('.ym-box').fadeOut(100);
          $scope.loadZlsqData(y + '-' + m);
        }
      }
    });
    caniclickthemonth = true;
    $('.ym-box').fadeIn(100);
  };
	
  //公共
  $scope.loadZlsqData = function (time) {
    $scope.checkedTime = time;
    $scope.uimodule.label.value = time;
    //遍历tab，分别加载各自的table数据
    window.showMask();
    var loadCount = $scope.uimodule.tabs.length;
    angular.forEach($scope.uimodule.tabs, function (tab) {
      if (tab.type == 'table') {
        var param = { xmid: window.top.xmid, cjbddm: cjbddm, cjbgdm: tab.id, jzrq: $scope.checkedTime };
        cwhbbbService.loadData(param, function (uidata) {
          fxService.setData($scope.uimodule, tab, uidata, $scope);
          loadCount--;
          if (loadCount == 0) {
            if (time && $scope.times.indexOf(time) < 0) {
              addTime(time);
            } else {
              window.changeflag = false;
            }
            window.hideMask();
          }
          $scope.sumRowRefresh(tab);
        });
      } else {
        loadCount--;
        if (loadCount == 0) {
          if (time && $scope.times.indexOf(time) < 0) {
            addTime(time);
          } else {
            window.changeflag = false;
          }
          window.hideMask();
        }
      }
    });
  }
	
  $scope.saveZlsqData = function () {
    $('div[contenteditable="true"]').blur();
    var param = { xmid: window.top.xmid, cjbddm: $scope.cjbddm, fjuuid: $scope.fjuuid };
    if (_fileUuid) {
      param.fileUuid = _fileUuid;
    }
    var cjbgs = [];
    if ($scope.uimodule.label) {
      if ($scope.uimodule.label.dataType == 'datetime') {
        param.jzrq = $scope.uimodule.label.value;
        if (!param.jzrq) {
          alert("资料属期不能为空");
          return;
        }
      }
      if ($scope.uimodule.label.dataType == 'label') {
        if (!$scope.uimodule.label.value) {
          alert('请导入模版数据');
          return;
        }
        param.jzrq = $scope.uimodule.label.value;
      }
    }
    var invalide = false;
    angular.forEach($scope.uimodule.tabs, function (tab, tabIndex) {
      if (!invalide) {
        var cjbg = { cjbgdm: tab.id };
        var cjmxs = [];
        if (tab.table && tab.table.tbody) {
          //一个表单的验证结果
          var validateResult = { succ: true, errors: {} };
          angular.forEach(tab.table.tbody.rows, function (row) {
            var cjmx = { cjmxdm: row.id, isdel: row.del ? true : false };
            angular.forEach(row.cells, function (cell, cellIndex) {
              if (invalide) {
                //暂时先注释掉吧
                //$scope.uimodule.tabActiveIndex = tabIndex;
                //锚点定位
                $scope.ui.tabIndex = tabIndex;
                /*$location.hash($scope.uimodule.tabs[tabIndex].id);
                    $anchorScroll();*/
              }
              if (cell.validate && !row.del) {
                var result = cell.validate(validateResult.errors[cell.property]);
                if (!result.succ) {
                  validateResult.succ = false;
                  invalide = true;
                  validateResult.errors[cell.property] = result;
                }
              }
              if (cell.dataType == 'text'
                || cell.dataType == 'textarea'
                || cell.dataType == 'select'
                || cell.dataType == 'datetime'
                || cell.dataType == 'number'
                || cell.dataType == 'dialog'
                || cell.dataType == 'label') {
                var value = cell.value;
                if (cell.dataType == 'number' && value) {
                  value = value.toString().replaceAll(',', '');
                }
                if (cell.unit) {
                  value = value.toString().replaceAll(cell.unit, '');
                }
                if (cell.dynamic) {
                  if (cjmx[cell.dynamicGroup]) {
                    cjmx[cell.dynamicGroup][cell.colIndex] = {};
                    cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                  } else {
                    cjmx[cell.dynamicGroup] = [];
                    cjmx[cell.dynamicGroup][cell.colIndex] = {};
                    cjmx[cell.dynamicGroup][cell.colIndex][cell.property] = value;
                  }
                } else {
                  cjmx[cell.property] = value;
                  if (cell.dataType == 'select') {
                    cjmx[cell.property + '_zdy'] = cell.zdy;
                    //对于需要放开修改指标分类，项目分析指标的表格组装数据
                    if (tab.id == "A0101-1" || tab.id == "A0201-1" || tab.id == "A0201-4"
                      || tab.id == "A0201-5" || tab.id == "A0401-1" || tab.id == "A0501-1"
                      || tab.id == "B0301-1" || tab.id == "B0302-1" || tab.id == "B0303-1"
                      || tab.id == "B0304-1" || tab.id == "C0101-1" || tab.id == "C0102-1"
                      || tab.id == "C0201-2" || tab.id == "B0204-1" || tab.id == "C0205-1"
                      || tab.id == "C0206-1" || tab.id == "C0207-1" || tab.id == "C0208-1"
                      || tab.id == "C0209-1" || tab.id == "D0401-1" || tab.id == "D0401-2"
                      || tab.id == "D0201-1" || tab.id == "A0301-1" || tab.id == "D0202-1"
                      || tab.id == "D0301-1" || tab.id == "D0101-1" || tab.id == "B0403-1") {
                      cjmx["zbfldm"] = tab.table.tbody.rows[row.rowIndex].data.zbfl;
                      cjmx["zbflvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].value;
                      cjmx["selectvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].selectname;
                      if (cjmx["zbflvalue"] != cjmx["selectvalue"]) {
                        cjmx["zbflvalue"] = cjmx["selectvalue"];
                      }
                    } else if (tab.id == "10101-1" || tab.id == "10101-2" || tab.id == "10101-3" ||
                      tab.id == "10201-1" || tab.id == "10201-2" || tab.id == "10201-3" ||
                      tab.id == "10201-4" || tab.id == "10301-1") {
                      cjmx["zbfldm"] = tab.table.tbody.rows[row.rowIndex].data.zbfl;
                      //cjmx["zbfldm"] = tab.table.tbody.rows[row.rowIndex].cells[2].value;
                      cjmx["zbflvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].value;
                      cjmx["selectvalue"] = tab.table.tbody.rows[row.rowIndex].cells[2].selectname;
                      if (cjmx["zbflvalue"] != cjmx["selectvalue"]) {
                        cjmx["zbflvalue"] = cjmx["selectvalue"];
                      }
                    }
                  }
                }
              }
            });
            cjmxs.push(cjmx);
          });
          if (!validateResult.succ) {
            //处理提示
            var errors = '';
            for (var k in validateResult.errors) {
              errors += ',' + validateResult.errors[k].propertyName + validateResult.errors[k].msg.join(',');
            }
            setPrompt(errors.substring(1), false);
          }
        }
        cjbg.cjmxs = cjmxs;
        //				//验证表头
        //				if(!checkIsNotEmptyDynamicHead(tab)){
        //					alert('请先添加动态列信息');
        //					invalide = true;
        //				}
        //把头也塞里
        if (!invalide && tab.table) {
          var title = [];
          angular.forEach(tab.table.thead.headRows, function (hr, headRowIndex) {
            var hrv = [];
            angular.forEach(hr.headCells, function (cell) {
              if (headRowIndex == 0) {
                if (!cell.value) {
                  invalide = true;
                  setPrompt(cell.propertyName + "不能为空", false);
                } else if (cell.regexp && isNotNull(cell.value)
                  && !(new RegExp(cell.regexp)).test(cell.value.toString())) {
                  invalide = true;
                  setPrompt(cell.propertyName + "格式错误", false);
                } else if (hrv.indexOf(cell.value) >= 0) {
                  invalide = true;
                  setPrompt(cell.propertyName + "不能重复", false);
                }
              }
              hrv.push(cell.value);
            });
            title.push(hrv);
          });
          cjbg.title = title;
        }
        if (!invalide && tab.subTable) {
          var fjs = [];
          if (tab.subTable.tbody) {
            angular.forEach(tab.subTable.tbody.rows, function (row) {
              var fjuuid = { fjuuid: row.id };
              fjs.push(fjuuid);
            });
          }
          cjbg.fjs = fjs;
        }
        if (tab.id != "A0101-1" && tab.id != "A0601-1") {//保存的时候，将股东层级结构和对外投资的表格数据过滤掉，这两个表格的数据只做展现，不做保存
          cjbgs.push(cjbg);
        }
      }
    });
    if (invalide) {
      return;
    }
    param.datas = angular.toJson(cjbgs);
    if (window.isRunningCommand == true) {
      return;
    }
    window.showMask();
    window.isRunningCommand = true;
    cwhbbbService.save(param, function (data) {
      window.hideMask();
      if (data.succ) {
        setPrompt('保存成功', true);
        changeflag = false;
        $scope.uimodule.label.value = $scope.checkedTime;
        $scope.loadZlsqData($scope.uimodule.label.value);
        //刷新图标
        $($scope.uimodule.tabs).each(function (i, t) {
          if (t.chart && t.chart.show) {
            t.chart.show = false;
            $timeout(function () {
              t.chart.show = true;
            }, 1000);
          }
        });
        window.isRunningCommand = false;
      } else {
        setPrompt(data.msg, false);
      }
    }, function () {
      window.hideMask();
      window.isRunningCommand = false;
      changeflag = false;
      setPrompt('保存失败', false);
    });
  }
	
  /**
   * 添加属期
   */
  $scope.addsqsrk = function () {
    $('#prompt').parent().hide(500);
    if (window.changeflag) {
      window.confirm('提示', '本期数据尚未保存,是否保存?', function () {
        $scope.saveZlsqData();
      }, function () {
        initYearMonthPicker();
      });
    } else {
      initYearMonthPicker();
    }
  }
	
  $scope.selectedTime = function (time) {
    if ($scope.checkedTime != time) {
      if (window.changeflag) {
        window.confirm('提示', '本期数据尚未保存,是否保存?', function () {
          $scope.checkedTime = time;
          $scope.saveZlsqData();
        }, function () {
          $scope.loadZlsqData(time);
        });
      } else {
        $scope.loadZlsqData(time);
      }
    }
  }
	
  //当前表格有无选中行
  $scope.hasSelectedRow = function (tab) {
    if (tab && tab.table && tab.table.tbody && tab.table.tbody.rows) {
      var count = 0;
      angular.forEach(tab.table.tbody.rows, function (row, rowIndex) {
        if (row.checked) {
          count++;
        }
      });
      return count;
    } else {
      return 0;
    }
  }
  //当前附件列表有无选中行
  $scope.hasSelectedFjlbRow = function (tab) {
    if (tab && tab.subTable && tab.subTable.tbody && tab.subTable.tbody.rows) {
      var count = 0;
      angular.forEach(tab.subTable.tbody.rows, function (row, rowIndex) {
        if (row.checked) {
          count++;
        }
      });
      return count;
    } else {
      return 0;
    }
  }
  //计算锚点的高度
  $scope.anchorPointHeight = function (uimodule) {
    if (uimodule && uimodule.tabs && uimodule.tabs.length >= 2 && uimodule.tabs[1].title != '综合分析意见') {
      if (uimodule.hasZlsq && uimodule.label && uimodule.label.show && $scope.times && $scope.times.length > 0) {
        return Math.ceil(($scope.times.length / 4) > ((uimodule.tabs.length - 1) / 5) ? ($scope.times.length / 4) : ((uimodule.tabs.length - 1) / 5)) * 31 + 11;
      } else {
        return Math.ceil((uimodule.tabs.length - 1) / 5) * 31 + 11;
      }
    } else {
      if (uimodule && uimodule.hasZlsq && uimodule.label && uimodule.label.show && $scope.times && $scope.times.length > 0) {
        return Math.ceil($scope.times.length / 4) * 31 + 11;
      } else {
        return 0;
      }
    }
  }

}