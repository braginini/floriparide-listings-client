export default angular
  .module('directives.dashboard', [])
  .directive('dashboard', function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/dashboard/dashboard.tpl.html',
      replace: true,
      scope: true,
      controller: function($scope, $state, $interval, $timeout) {
        $scope.currentTime = new Date();

        var intervalPromise;
        var msLeft = 1000 - $scope.currentTime.getMilliseconds();
        $timeout(function () {
          intervalPromise = $interval(function () {
            $scope.currentTime = new Date();
          }, 1000);
        }, msLeft);

        $scope.search = function (e) {
          var el = angular.element(e.target).parents('li');
          var div = el.find('> div')[1];
          if (div) {
            if (angular.element(div).attr('data-rubrics') !== undefined) {
              $state.go('main.rubrics');
            } else {
              $state.go('main.search', {query: div.innerHTML});
            }
          }
        };

        $scope.close = function () {
          $scope.$emit('dashboard.close');
        };

        $scope.$on('$destroy', function () {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
          }
        });
      }
    };
  })
;
