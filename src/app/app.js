
angular.module('myapp', ['ngRoute', 'ngDialog','ngSwordHttp', 'xmcjgy', 'fx'])
  .config(['$routeProvider', '$compileProvider', ($routeProvider, $compileProvider) => {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|pageoffice|ftp|mailto|file|javascript):/);

    // $routeProvider
    //   .otherwise({
    //     templateUrl: 'app/app.html',
    //     controller: 'myCtrl'
    //   });
  }]);
