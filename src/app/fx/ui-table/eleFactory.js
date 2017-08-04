import { calTabIndex, escapeHtml, escapeStr } from './utils';
export const eleFactory = {
  checkbox: createCheckBox,
  select: createSelect,
  label: createLabel,
  href: createHref,
  dialog: createDialog,
  TAB: createTab,
  text: createText,
  disable: createDisable,
  textarea: createTextarea,
  upload: createUpload,
  fileselect: createFileSelect,
  number: createNumber,
  datetime: createDateTime,
  fileview: createFileView,
};

function createCheckBox() {
  return `<input 
      react-ele
      type="checkbox"
    />`;
}

function createSelect() {
  if (!this.cell.custom && !this.row.id) {
    return `
      <select react-ele
        style="width: 100%;position: relative;z-index: 1;" 
        onchange="window.changeflag=true"/>
        ${this.cell.options.map(opt => `<option value="${opt.value}">${opt.name}</option>`)}
      </select>`;
  } else if ((this.cell.custom && !this.row.id) || this.cell.writeable) {
    let value = '';
    if(this.cell.options) {
      let _opt = this.cell.options.find(opt => opt.value === this.cell.value);
      value = _opt.name;
    }  
    return `<input react-ele
      onchange="window.changeflag=true"
      value="${escapeHtml(value)}" 
      placeholder="请选择"
      style="width: 100%;" type="text" />`;
  } else if (this.row.id && !this.cell.writeable) {
    return this.cell.options.map(opt => `<div><span>${opt.name}</span></div>`);
  } else {
    return '';
  }
}

function createLabel() {
  return `<span react-ele>${escapeHtml(this.cell.value)}</span>`;
}

function createHref() {
  if (cell.value) {
    return '<a react-ele style="font-weight: bold;" target="_blank">${escapeHtml(this.cell.value)}</a>';
  } else {
    return `<span react-ele>${escapeHtml(this.cell.value)}</span>`;
  }
}

function createTab() {
  if (this.cell.href != '' && this.cell.href != '/') {
    return `<a react-ele href="javascript:;"style="font-weight: bold;" >${escapeHtml(this.cell.value)}</a>`;
  } else {
    return `<span react-ele>${escapeHtml(this.cell.value)}</span>`;
  }
}

function createFileView() {
  return '<a react-ele href="javascript:;">预览</a>';
}

function createText() {
  return `<div 
    contenteditable="false"
    react-ele
    paste-text
    onchange="window.changeflag=true" style="width: 100%;"
    type="text"
    value="${escapeHtml(this.cell.value)}" 
  ></div>`;
}

function createDialog() {
  if (this.row.data && this.row.data[this.cell.dataSource]) {
    return `<a react-ele href="javascript:;" style="font-weight: bold;">${escapeHtml(this.cell.value)}</a>`;
  } else {
    return `<span react-ele>${escapeHtml(this.cell.value)}</span>`;
  }
}

function createDisable() {
  return `<div react-ele><span>${this.cell.value ? escapeHtml(this.cell.value) : '---'}</span></div>`;
}

function createTextarea() {
  return `
    <div react-ele
      ng-paste-text
      contenteditable="false" paste-text
      style="outline:none;position: relative;z-index: 1;margin: 3px;min-height:16px;white-space:normal;word-break:break-all;word-wrap:break-word; " 
    >${escapeHtml(this.cell.value)}</div>`;
}

function createUpload() {
  if (this.row.id && this.cell.haveCjmbFlag && this.tab.id != '10101-1' && this.tab.id != '10101-2'
    && this.tab.id != '10101-3' && this.tab.id != '10201-1' && this.tab.id != '10201-2' && this.tab.id != '10201-3' && this.tab.id != '10201-3' && this.tab.id != '10301-1') {
    return `
      <div react-ele>
        <a href="javascript:;" class="upload-ft">访谈</a> 
      </div>`;
              
  } else if (this.row.id && !this.cell.haveCjmbFlag) {
    return `
      <div react-ele> 
        <a href="javascript:;" class="upload-sc">上传</a>
        ${this.cell.value ? `<a href="javascript:;" class="upload-view">预览(${this.row.data.fjsl})</a> ` : ''}
        ${this.cell.value ? `<a href="javascript:;" class="upload-del">删除</a> ` : ''}
      </div>`;
  } else if (this.row.id && this.cell.haveCjmbFlag && (this.tab.id == '10101-1' || this.tab.id == '10101-2'
    || this.tab.id == '10101-3' || this.tab.id == '10201-1' || this.tab.id == '10201-2' || this.tab.id == '10201-3' || this.tab.id == '10201-3' || this.tab.id == '10301-1')) {
    return `
      <div react-ele> 
        <a href="javascript:;" class="upload-sc">上传</a> 
        ${this.cell.value ? `<a href="javascript:;" class="upload-view">预览(${this.row.data.fjsl})</a> ` : ''}
        ${this.cell.value ? `<a href="javascript:;" class="upload-del">删除</a> ` : ''}
        <a target="_blank" class="upload-template">模板</a> 
      </div>`;
  } else if (!this.row.id) {
    return '<div react-ele><a href="javascript:;" class="upload-save">保存</a></div>';
  } else {
    return '';
  }
}

function createFileSelect() {
  return `
    <div react-ele> 
      <a href="javascript:;">获取</a>
      ${this.cell.value ? `<a href="javascript:;">预览</a> ` : ''}
    </div>`
}

function createNumber() {
  return `
    <div react-ele
      contenteditable="false"
      onblur="window.changeflag=true"
      style="width: 100%; text-align: right;"
      type="text">${escapeHtml(this.cell.value)}</div>`;
};

function createDateTime() {
  return `<input 
    react-ele
    onchange="window.changeflag=true"
    type="text"
    style="width: 100%;"
    value="${escapeStr(this.cell.value)}" 
    class="l_member_date"
  />`;
  ;
}
