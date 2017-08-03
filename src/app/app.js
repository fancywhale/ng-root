import {
  CONTEXT_COPY,
  CONTEXT_NEW_DOWN,
  CONTEXT_DELETE,
  CONTEXT_NEW_UP,
  CONTEXT_PASTE,
} from '../shared/models'

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
      
    let options = {
      selector: 'td.react-cell',
      callback: function (key, opt) {
        this[0].__celldata.triggerContext(key);
      },
      items: {
        [CONTEXT_NEW_UP]: {
          name: "插入上方行",
          visible: function (key, opt) {
            return !this[0].__celldata.row.isFirst;
          },
        },
        [CONTEXT_NEW_DOWN]: {
          name: "插入下方行",
          visible: function (key, opt) {
            return !this[0].__celldata.row.isLast;
          }
        },
        "sep1": "---------",
        [CONTEXT_COPY]: {
          name: "复制",
          visible: function () {
            return this.find('[ng-paste-text]').length;
          },
        },
        [CONTEXT_PASTE]: {
          name: "黏贴",
          visible: function () {
            return this.find('[ng-paste-text]').length;
          },
        },
        "sep2": {
          name: "---------",
          visible: function () {
            return this.find('[ng-paste-text]').length;
          }
        },
        [CONTEXT_DELETE]: { name: "删除行" },
      }
    };
    $.contextMenu(options);

  }]);
