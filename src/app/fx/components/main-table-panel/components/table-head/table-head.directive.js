angular.module('fx')
  .directive('fxTableHead', [() => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fx/components/main-table-panel/components/table-head/table-head.html',
    }
  }]);

angular.module('fx')
  .controller('fxTableHeaderController', ['$scope', 'fxTableHeadService', fxTableHeadController]);


function fxTableHeadController($scope, fxTableHeadService) {
  
  $scope.editModleOn = (id, edithead) => {
    fxTableHeadService.editModleOn(id, edithead);
    window.setTimeout("$('#" + id + "').focus();", 50);
  }

  $scope.editModleOff = (id, edithead, editheads) => {
    fxTableHeadService.editModleOff(id, edithead, editheads);
  };

  $scope.editColumn = function (uiheadcell, index) {
    uiheadcell.editmodle = !uiheadcell.editmodle;
    $scope.editModleOn(uiheadcell.property + index, uiheadcell);
  }

  $scope.addColumn = function (addHead, table, headCellIndex) {
    fxTableHeadService.addColumn(addHead, table, headCellIndex);
    setTimeout(() => {
      $(`#${addHead.property + (headCellIndex + 1)}`).focus();
    }, 50);
  }
	
  $scope.delColumn = function (addHead, table, index) {
    fxTableHeadService.delColumn(addHead, table, index);
  }

  $scope.countDynamic = function (headCells) {
    return fxTableHeadService.countDynamic(headCells);
  }
}
