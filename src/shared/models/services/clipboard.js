import { UISelection } from './selection';
import { isIE } from '../../utils';

export class UIClipboard {

  constructor(table) {
    this._table = table;
    this._delegateEle = null;
    this.init();
  }

  init() {
    if (document.queryCommandSupported('copy')) {
      this._delegateEle = document.getElementById('_clipboardDelegator');
      this._delegateEle || this._creatDelegateElement();
    }
    this._initCopy();
    this._initPaste();
  }

  dispose() {
    $(this._table._ele).off('.ui-clipboard');
    this._table = null;
  }

  copySelection() {
    this._copySelection();
  }

  pasteSelection() {
    this._pasteSelection();
    this._table.scope.$apply();
  }

  _initPaste() {
    $(this._table._ele).on('paste.ui-clipboard', (e) => {
      if (!this._table.selection.length) return;
	  
      this._pasteSelection(e);
      this._table.scope.$apply();
      
      event.preventDefault();
      event.stopPropagation();
	  return false;
    });
  }

  _initCopy() {
    $(this._table._ele).on('copy.ui-clipboard', (e) => {
      if (!this._table.selection.length) return;
      this._copySelection(e);
	  return false;
    });
  }

  _pasteSelection(e) {
    let pastedText = this._getClipboardData(e);

    let formatted = pastedText.split('\n').map(s => s.split('\t'));
    if (!formatted.length || !formatted[0].length) return;

    let selection = this._sortSelections(this._table.selection);
    let cell = this._table.selection[0];

    formatted.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, cellIndex) => {
        if (cell.rowDataIndex + rowIndex >= this._table.rows.length) return;
        let _cell = this._table.rows[cell.rowDataIndex + rowIndex]
          .cells[cell.cellDataIndex + cellIndex];
        if (!_cell || !_cell.editable) return;
        _cell.value = formatted[rowIndex][cellIndex];
      });
    });

  }

  _copySelection(e) {
    let result = this._formatCopyContent(this._table.selection);
    console.log(result);;

    this._copyTextToClipboard(result, e);
  }

  _formatCopyContent(selection) {
    if (!selection || !selection.length) return;
    selection = this._sortSelections(selection);

    let rowIndex = selection[0].row.rowIndex;
    let pasteStr = [];
    let rowStr = [];
    pasteStr.push(rowStr);
    selection.forEach(cell => {
      if (rowIndex !== cell.row.rowIndex) {
        rowIndex = cell.row.rowIndex;
        rowStr = [];
        pasteStr.push(rowStr);
      }
      rowStr.push(cell.value);
    });

    return pasteStr
      .map(row => row.join('\t'))
      .join('\n');
  }
  
  _sortSelections(selection) {
    return UISelection.sortSelections(selection);
  }

  _getClipboardData(event) {
    if (!document.queryCommandSupported('copy')) {
      if (isIE()) {
        return window.clipboardData.getData('Text');
      } else {
        return event.originalEvent.clipboardData.getData('Text');
      }
    } else {
      this._delegateEle.select();
      document.execCommand('paste');
      return this._delegateEle.value;
    }
  }

  _copyTextToClipboard(text, event) {
    if (!document.queryCommandSupported('copy')) {
      if (isIE()) {
        window.clipboardData.setData('Text', text);
      } else {
        event.originalEvent.clipboardData.setData('Text',copyText);
      }
    } else {
      this._delegateEle.value = text;
      this._delegateEle.select();
      document.execCommand('copy');
    }
  }

  _creatDelegateElement() {
    let textArea = document.createElement("textarea");
    textArea.id = '_clipboardDelegator';

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);

    this._delegateEle = textArea;
  }

}
