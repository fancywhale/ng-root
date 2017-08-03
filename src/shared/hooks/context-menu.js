
export function contextMenuHook(selector, callback) {
  let options = {
    selector: 'td.react-cell',
    callback,
    items: {
      "new": { name: "新建", icon: "fa-edit" },
      "sep1": "---------",
      "copy": { name: "复制", icon: "fa-copy" },
      "paste": { name: "黏贴", icon: "fa-paste" },
      "sep2": "---------",
      "delete": { name: "删除", icon: "fa-remove" },
    }
  };
  $.contextMenu(options);
}
