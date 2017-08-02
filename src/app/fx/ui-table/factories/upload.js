
export function createUpload(input) {
  let ele = input.cell.ele.children[0];

  // many things to do
  $(ele).find('.upload-ft').click(() => {
    input.scope.openFtjl(input.cell);
    input.scope.$apply();
  });
  $(ele).find('.upload-view').click(() => {
    input.scope.viewFile(input.row.data.cjmxdm);
  })
  $(ele).find('.upload-del').click(() => {
    input.scope.delFile(input.row.data.cjmxdm, input.cell);
  });
  $(ele).find('.upload-save', () => {
    input.scope.exeCommand({ action: 'saveRow', tabid: input.tab.id }, input.row);
  });
  return ele;
}