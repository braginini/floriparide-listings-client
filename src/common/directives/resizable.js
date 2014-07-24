(function() {
  'use strict';

  angular.module('directives.resizable', [])
    .directive('resizable', function($window) {
      return function ($scope) {
        // On window resize => resize the app
        $scope.initializeWindowSize = function () {
          $scope.windowHeight = $window.innerHeight;
          $scope.windowWidth = $window.innerWidth;
        };

        angular.element($window).bind('resize', function () {
          $scope.initializeWindowSize();
          $scope.$apply();
        });

        // Initiate the resize function default values
        $scope.initializeWindowSize();
      };
    });
})();
