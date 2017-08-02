
export function createFileSelect(input) {
  let ele = input.cell.ele.children[0];
  let links = $(ele).find(a);
  ele.children[0].addEventListener('click', () => {
    input.fileSelect(input.row.id);
    input.scope.$apply();
  });
  ele.children[1].addEventListener('click', () => {
    input.viewFile(input.row.id);
    input.scope.$apply();
  });
  return ele;
}
