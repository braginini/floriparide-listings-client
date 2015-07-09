System.registerModule("src/common/directives/resizable.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/resizable.js";
  var $__default = angular.module('directives.resizable', []).directive('resizable', ["$window", function($window) {
    return function($scope) {
      $scope.initializeWindowSize = function() {
        $scope.windowHeight = $window.innerHeight;
        $scope.windowWidth = $window.innerWidth;
      };
      angular.element($window).bind('resize', function() {
        $scope.initializeWindowSize();
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      });
      $scope.initializeWindowSize();
    };
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/resizable.js
