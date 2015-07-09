System.registerModule("src/common/directives/scrollbar.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/scrollbar.js";
  var $__default = angular.module('directives.scrollbar', []).directive('scrollbar', ["$window", function($window) {
    return {
      restrict: 'EA',
      replace: false,
      link: function($scope, element, attrs) {
        var winEl = angular.element($window);
        var domEl = element[0];
        var Ps = $window.Ps;
        Ps.initialize(domEl, {minScrollbarLength: 30});
        var update = function() {
          Ps.update(domEl);
        };
        winEl.on('resize', update);
        $scope.$on('layoutUpdated', update);
        $scope.$on('$destroy', (function() {
          winEl.off('resize', update);
          Ps.destroy(domEl);
          domEl = null;
          winEl = null;
        }));
      }
    };
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/scrollbar.js
