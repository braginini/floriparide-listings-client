export default angular
  .module('directives.scrollbar', [])
  .directive('scrollbar', function ($window) {
    return {
      restrict: 'EA',
      replace: false,
      link: function ($scope, element, attrs) {
        var winEl = angular.element($window);
        var domEl = element[0];
        var Ps = $window.Ps;
        Ps.initialize(domEl, {
          minScrollbarLength: 30
        });

        var update = function () {
          if (domEl) {
            Ps.update(domEl);
          }
        };
        winEl.on('resize', update);

        $scope.$on('layoutUpdated', update);

        $scope.$on('$destroy',() => {
          winEl.off('resize', update);
          Ps.destroy(domEl);
          domEl = null;
          winEl = null;
        });
      }
    };
  })
;
