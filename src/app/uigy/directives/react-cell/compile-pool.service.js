angular.module('xmcjgy')
  .service('CellCompilePoolService', ['$timeout', function ($timeout) {

    var _compilePool = [];
    var _compileStarted = false;

    var createTask = function (proc) {
      _compilePool.push(proc);
    };

    var startCompile = function (maxLength) {
      if (!_compileStarted) {
        _compileStarted = true;
        $timeout(function () {
          _runCompile(maxLength);
        })
      }
    }

    var removeTask = function (proc) {
      var index = _compilePool.indexOf(proc);
      if (index !== -1) {
        _compilePool.splice(index, 1);
      }
    }
    
    var _runCompile = function (maxLength) {
      if (!_compilePool.length) {
        _compileStarted = false;
        return;
      }
      var $promises = _compilePool.length > maxLength ? _compilePool.splice(0, maxLength)
        : _compilePool.splice(0, _compilePool.length);
                
      Promise.all($promises.map(function (p) { return p(); })).then(function () {
        $timeout(function () {
          _runCompile(maxLength);
        }, 1);
      });
    };

    return {
      startCompile: startCompile,
      createTask: createTask,
      removeTask: removeTask,
    };
  }]);