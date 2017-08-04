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
          disabled: function (key, opt) {
            let cell = this[0].__celldata;
            return !(!cell.row.isFirst
              && cell._table._tab
              && cell._table._tab.footerbar
              && cell._table._tab.footerbar.buttons
              && cell._table._tab.footerbar.buttons.find(button => button.action === 'add'));
          },
        },
        [CONTEXT_NEW_DOWN]: {
          name: "插入下方行",
          disabled: function (key, opt) {
            let cell = this[0].__celldata;
            return !(!cell.row.isLast
              && cell._table._tab
              && cell._table._tab.footerbar
              && cell._table._tab.footerbar.buttons
              && cell._table._tab.footerbar.buttons.find(button => button.action === 'add'));
          }
        },
        "sep1": "---------",
        [CONTEXT_COPY]: {
          name: "复制",
          disabled: function () {
            let cell = this[0].__celldata;
            return !cell.editable || !document.queryCommandSupported('copy');
          },
        },
        [CONTEXT_PASTE]: {
          name: "黏贴",
          disabled: function () {
            let cell = this[0].__celldata;
            return !cell.editable || !document.queryCommandSupported('copy');
          },
        },
        "sep2": "---------",
        [CONTEXT_DELETE]: {
          name: "删除行",
          disabled: function (key, opt) {
            let cell = this[0].__celldata;
            return !(!cell.row.isLast
              && cell._table._tab
              && cell._table._tab.footerbar
              && cell._table._tab.footerbar.buttons
              && cell._table._tab.footerbar.buttons.find(button => button.action === 'delete'));
          }
        },
      }
    };
    $.contextMenu(options);

  }]);
