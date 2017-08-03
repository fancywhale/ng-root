
export class UIClipboard {

  constructor(table) {
    this._table = table;
    this.init();
  }

  init() {
    this._initCopy();
    this._initPaste();
  }
  _initPaste(){
    $(this._table._ele).on('paste', () => {
      if (!selection.length) return;

      var pasteText = '';
      if (window.clipboardData && window.clipboardData.getData) { // IE  
        pastedText = window.clipboardData.getData('Text');
      } else {
        pastedText = event.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');  
      }
      console.log(pasteText);
    });
  }

  _initCopy() {
    $(this._table._ele).on('copy', () => {
      if (!this._table.selection.length) return;
      
      let selection = this._table.selection
        .sort((cell1, cell2) => (cell1.rowDataIndex > cell2.rowDataIndex ? 1 : -1))
        .sort((cell1, cell2) => (cell1.cellDataIndex > cell2.cellDataIndex ? 1 : -1));
      
      let rowIndex = -1;
      let pasteStr = [];
      let rowStr = null;
      selection.forEach(cell => {
        if (rowIndex !== cell._row.rowIndex) {
          rowIndex = cell._row.rowIndex;
          if (rowStr) {
            rowStr = [];
          } else {
            pasteStr.push(rowStr);
          }
        }
        rowStr.push(cell.value);
      });

      let result = pasteStr
        .map(row => row.join('\t'))
        .join('\n');
      
      console.log(result);;
      
      if (window.clipboardData && window.clipboardData.getData) { // IE  
				window.clipboardData.setData('Text', result);
			} else {
				event.originalEvent.clipboardData.setData('Text', result);
			}
      
    });
  }
}