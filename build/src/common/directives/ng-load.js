System.registerModule("src/common/directives/ng-load.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/ng-load.js";
  var $__default = angular.module('directives.ngLoad', ['ng']).directive('ngLoad', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      restrict: 'A',
      compile: function($element, attr) {
        var fn = $parse(attr.ngLoad);
        return function(scope, element, attr) {
          element.on('load', function(event) {
            $timeout(function() {
              scope.$apply(function() {
                fn(scope, {$event: event});
              });
            });
          });
        };
      }
    };
  }]).directive('ngError', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      restrict: 'A',
      compile: function($element, attr) {
        var fn = $parse(attr.ngError);
        return function(scope, element, attr) {
          element.on('error', function(event) {
            $timeout(function() {
              scope.$apply(function() {
                fn(scope, {$event: event});
              });
            });
          });
        };
      }
    };
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/ng-load.js
