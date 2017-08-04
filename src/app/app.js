
angular.module('myapp', ['ngRoute', 'ngDialog','ngSwordHttp', 'xmcjgy', 'fx'])
  .config(['$routeProvider', '$compileProvider', '$logProvider', ($routeProvider, $compileProvider, $logProvider) => {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|pageoffice|ftp|mailto|file|javascript):/);
    $logProvider.debugEnabled(true);
    // $routeProvider
    //   .otherwise({
    //     templateUrl: 'app/app.html',
    //     controller: 'myCtrl'
    //   });
  }])
  .run(['$rootScope', ($rootScope) => {
      
  }]);
