import { UISelection } from './selection';

export class UIClipboard {

  constructor(table) {
    this._table = table;
    this._deleteEle = null;
    this.init();
  }

  init() {
    if (!document.queryCommandSupported('copy')) return;
    this._deleteEle = document.getElementById('_clipboardDelegator');
    this._deleteEle || this._creatDelegateElement();
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
    $(this._table._ele).on('keydown.ui-clipboard', (e) => {
      if (!this._table.selection.length) return;
      if (!(e.keyCode == 86 && e.ctrlKey || e.keyCode == 86 && e.metaKey)) return;

      this._pasteSelection();
      this._table.scope.$apply();
      
      event.preventDefault();
      event.stopPropagation();
    });
  }

  _initCopy() {
    $(this._table._ele).on('keydown.ui-clipboard', (e) => {
      if (!(e.keyCode == 67 && e.ctrlKey || e.keyCode == 67 && e.metaKey)) return;
      if (!this._table.selection.length) return;
      this._copySelection();
    });
  }

  _pasteSelection() {
    let pastedText = this._getClipboardData();

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

  _copySelection() {
    let result = this._formatCopyContent(this._table.selection);
    console.log(result);;

    this._copyTextToClipboard(result);
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

  _getClipboardData() {
    this._deleteEle.select();
    document.execCommand('paste');
    return this._deleteEle.value;
  }

  _copyTextToClipboard(text) {
    this._deleteEle.value = text;
    this._deleteEle.select();
    document.execCommand('copy');
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

    this._deleteEle = textArea;
  }

}
