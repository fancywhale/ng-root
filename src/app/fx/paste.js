export const pasteController = (function ($) {
  return () => {
    $('body').on('paste', '[paste-text]', (e) => {
      console.log(e);
    });
  
    // $.csspaste = function(scope,element) {
    // 	var currentCell = scope.cell;
    // 	var currentRow = scope.row;
		
    // 	var startRowIndex = currentRow.rowIndex;
    // 	var currentRowIndex = startRowIndex;
		
    // 	var startCellIndex = currentCell.colIndex;
    // 	var currentCellIndex = startCellIndex;
					
    // 	//获取table一共有多少行多少列
    // 	var maxRowIndex = scope.table.rows.length - 1;
    // 	var maxColIndex = currentRow.cells.length - 1;

    // 	$(element).bind("paste",function(event){
    // 		currentRowIndex = startRowIndex;
    // 		currentCellIndex = startCellIndex;
			
    // 		var pasteText = undefined;
    // 		if (window.clipboardData && window.clipboardData.getData) { // IE  
    //             pastedText = window.clipboardData.getData('Text');  
    //         } else {  
    //             pastedText = event.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');  
    //         }
    // 	 	var rows = pastedText.split('\n');
    //         $.each(rows,function(rowIndex,row){
    //         	//获取每一行有多少列
    //         	var cols = row.split('\t');
    //         	//从当前单元格作为第一行第一列开始粘贴
    //         	$.each(cols,function(colIndex,col){
    //         		currentCell = scope.table.rows[currentRowIndex].cells[currentCellIndex];
    //         		if(col){
    //         			scope.$apply(function(){
    //         				currentCell.value = $.trim(col);	        				
    //         			});			        			
    //         			if(!window.changeflag){
    //         				window.changeflag = true;
    //         			}
    //         		}			        		
    //         		//console.log('第'+currentRowIndex+'行,第'+currentCellIndex+'列:' + currentCell.value);
    //         		if(currentCellIndex == maxColIndex){
    //         			currentCellIndex = startCellIndex;
    //         		}else{
    //         			currentCellIndex = currentCellIndex + 1;
    //         		}
    //         	});
    //         	if(currentRowIndex == maxRowIndex){
    //         		return false;
    //         	}else{
    //         		currentRowIndex = currentRowIndex + 1;
    //         		currentCellIndex = startCellIndex;
    //         	}
    //         });	
    //         return false;
    // 	});
    // };
	
    // var startCellIndex;
    // var startRowIndex;
    // var selectCells = new Array();
    // var selectRows = new Array();
    // var dataTypes = new Array();
    // $.csscopy = function(scope,element) {
    // 	var currentCell = scope.cell;
    // 	var currentRow = scope.row;
    // 	var dataType = scope.cell.dataType;
    // 	$(element).closest('td').bind('mousedown',function(e){
    // 		if(!e.shiftKey){
    // 			startCellIndex = currentCell.colIndex;
    // 			startRowIndex = currentRow.rowIndex;
    // 		}
			
    // 		dragContent(e);
    // 	}).bind('mousemove',function(e){
    // 		hasMove = true;
    // 		if(dragging){
    // 			var currentCellIndex = scope.cell.colIndex;
    // 			var currentRowIndex = scope.row.rowIndex;		
    // 			multiSelect(scope,startCellIndex,currentCellIndex,startRowIndex,currentRowIndex);
    // 		}
    // 	}).bind('mouseup',function(e){
    // 		dragContent(e);
    // 	});
		
    // 	$(element).closest('td').bind('click',function(e){
    // 		if(selectCells.length == 0){
    // 			selectCells.push(scope.cell);
    // 			selectRows.push(currentRow);
    // 		}else if(selectCells.length == 1){
    // 			if(e.shiftKey){
    // 				selectCells.push(scope.cell);
    // 				selectRows.push(currentRow);
    // 			}else{					
    // 				selectCells.splice(0,selectCells.length);
    // 				selectCells.push(scope.cell);
					
    // 				selectRows.splice(0,selectRows.length);
    // 				selectRows.push(currentRow);
    // 			}				
    // 		}else if(selectCells.length == 2){
    // 			if(e.shiftKey){
    // 				selectCells.splice(1,selectCells.length);
    // 				selectCells.push(scope.cell);
					
    // 				selectRows.splice(1,selectRows.length);
    // 				selectRows.push(currentRow);
    // 			}else{					
    // 				selectCells.splice(0,selectCells.length);
    // 				selectCells.push(scope.cell);
					
    // 				selectRows.splice(0,selectRows.length);
    // 				selectRows.push(currentRow);
    // 			}
    // 		}else{
    // 			selectCells.splice(0,selectCells.length);
    // 			selectCells.push(scope.cell);
				
    // 			selectRows.splice(0,selectRows.length);
    // 			selectRows.push(currentRow);
    // 		}
			
    // 		if(!hasMove){
    // 			//console.log(startCellIndex + ':' + scope.cell.colIndex);
    // 			multiSelect(scope,startCellIndex,scope.cell.colIndex,startRowIndex,scope.row.rowIndex);							
    // 		}else{
    // 			if(selectCells.length == 2 && selectRows.length == 2){
					
    // 				var startCell = selectCells[0];
    // 				var endCell = selectCells[1];
					
    // 				var startRow = selectRows[0];
    // 				var endRow = selectRows[1];
					
    // 				//循环列
    // 				if(startCell.colIndex <= endCell.colIndex){
    // 					for(var cellIndex = startCell.colIndex;cellIndex<=endCell.colIndex;cellIndex++){
    // 						if(startRow.rowIndex <= endRow.rowIndex){
    // 							for(var rowIndex = startRow.rowIndex;rowIndex<=endRow.rowIndex;rowIndex++){
    // 								//console.log($('#'+dataType+'_'+scope.tab.id+'_'+rowIndex+'_'+cellIndex));
    // 								$('#'+scope.tab.id+'_'+rowIndex+'_'+cellIndex).parent('td').addClass('td_selected');						
    // 							}
    // 						}else{
    // 							for(var rowIndex = endRow.rowIndex;rowIndex<=startRow.rowIndex;rowIndex++){
    // 								$('#'+scope.tab.id+'_'+rowIndex+'_'+cellIndex).parent('td').addClass('td_selected');						
    // 							}
    // 						}		
    // 					}					
    // 				}else{
    // 					for(var cellIndex = endCell.colIndex;cellIndex<=startCell.colIndex;cellIndex++){
    // 						if(startRow.rowIndex <= endRow.rowIndex){
    // 							for(var rowIndex = startRow.rowIndex;rowIndex<=endRow.rowIndex;rowIndex++){
    // 								currentCell = scope.table.rows[rowIndex].cells[cellIndex];						
    // 								$('#'+scope.tab.id+'_'+rowIndex+'_'+cellIndex).parent('td').addClass('td_selected');						
    // 							}
    // 						}else{
    // 							for(var rowIndex = endRow.rowIndex;rowIndex<=startRow.rowIndex;rowIndex++){
    // 								currentCell = scope.table.rows[rowIndex].cells[cellIndex];						
    // 								$('#'+scope.tab.id+'_'+rowIndex+'_'+cellIndex).parent('td').addClass('td_selected');						
    // 							}
    // 						}		
    // 					}
    // 				}
    // 			}						
    // 		}
    // 	});
		
    // 	$(element).bind("copy",function(event){			
    // 		if($('.td_selected').size() <= 0){
    //       		return;
    //       	}
    //       	var copyText = '';
    //       	var rows = $('#main_table_'+scope.tab.id).find('tr');
    //       	rows.each(function(index){
    //       		var cells = $(this).find('.td_selected');
    //       		if(cells.size() > 0){	
    //       			cells.each(function(i){        				
    //       				if(i == cells.size()-1){
    //       					var dom = $(this).find('div');
    //                   		if(dom.size() > 0){
    //                   			copyText = copyText + $.trim(dom.text()) + '\n';                			
    //                   		}else{
    //                   			dom = $(this).find('input');
    //                   			copyText = copyText + $.trim(dom.val()) + '\n';
    //                   		}
    //       				}else{
    //       					var dom = $(this).find('div');
    //                   		if(dom.size() > 0){
    //                   			copyText = copyText + $.trim(dom.text()) + '\t';                			
    //                   		}else{
    //                   			dom = $(this).find('input');
    //                   			copyText = copyText + $.trim(dom.val()) + '\t';
    //                   		}
    //       				}        				        				
    //       			});        			
    //       		}        		
    //       	});
    //       	copyText = copyText.substring(0,copyText.length-1);
    //       	//console.log(copyText);
    //       	if (window.clipboardData && window.clipboardData.getData) { // IE  
    //             window.clipboardData.setData('Text',copyText);  
    //         } else {  
    //             event.originalEvent.clipboardData.setData('Text',copyText);//e.clipboardData.getData('text/plain');  
    //         }
    // 		return false;
    // 	});
    // }
	


    var controller = {
      dragging: null,
      items: new Map(),
      hasMov: false,
    };

    function dragContent(event) {
      var target = event.target || event.srcElement;
      switch (event.type) {
        case "mousedown":
          controller.dragging = target;
          hasMove = false;
          $('.td_selected').removeClass('td_selected');
          items = new Map();
          break;
        case "mouseup":
          controller.dragging = null;
          hasMove = false;
          startCellIndex = undefined;
          startRowIndex = undefined;
          break;
      }
    }

    /*var clearSlct= "getSelection" in window ? function(){
     window.getSelection().removeAllRanges();
    } : function(){
     document.selection.empty();
    };*/

    function multiSelect(scope, startCellIndex, currentCellIndex, startRowIndex, currentRowIndex) {
      //clearSlct();
      $('.td_selected').removeClass('td_selected');
      //console.log(startCellIndex + ':' + currentCellIndex);
      if (startCellIndex <= currentCellIndex) {
        for (var cellIndex = startCellIndex; cellIndex <= currentCellIndex; cellIndex++) {
			
          if (startRowIndex <= currentRowIndex) {
            for (var rowIndex = startRowIndex; rowIndex <= currentRowIndex; rowIndex++) {
              $('#' + scope.tab.id + '_' + rowIndex + '_' + cellIndex).parent('td').addClass('td_selected');
            }
          } else {
            for (var rowIndex = currentRowIndex; rowIndex <= startRowIndex; rowIndex++) {
              $('#' + scope.tab.id + '_' + rowIndex + '_' + cellIndex).parent('td').addClass('td_selected');
            }
          }
        }
      } else {
        for (var cellIndex = currentCellIndex; cellIndex <= startCellIndex; cellIndex++) {
          if (startRowIndex <= currentRowIndex) {
            for (var rowIndex = startRowIndex; rowIndex <= currentRowIndex; rowIndex++) {
              $('#' + scope.tab.id + '_' + rowIndex + '_' + cellIndex).parent('td').addClass('td_selected');
            }
          } else {
            for (var rowIndex = currentRowIndex; rowIndex <= startRowIndex; rowIndex++) {
              $('#' + scope.tab.id + '_' + rowIndex + '_' + cellIndex).parent('td').addClass('td_selected');
            }
          }
        }
      }
    }
  };
})(window.jQuery);
