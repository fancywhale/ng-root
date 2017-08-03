angular.module('fx')
  .directive('functionMenu', [() => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/fx/components/function-menu/function-menu.html',
      controller: ['$scope', ($scope)=> {
        $scope.initDrag();
      }],
    }
  }]);
