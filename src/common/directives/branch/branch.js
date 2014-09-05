(function () {
  angular
    .module('directives.branch', [
      'directives.rating',
      'directives.contact',
      'directives.branchSchedule'
    ])
    .directive('branch', [function () {
      return {
        restrict: 'EA',
        controller: 'BranchCtrl',
        templateUrl: 'directives/branch/branch.tpl.html',
        replace: true,
        scope: {
          b: '=branch'
        },
        link: function ($scope, element, attrs) {

        }
      };
    }])
    .controller('BranchCtrl', ['$scope', function($scope) {

    }])
    .directive('branchCard', ['$timeout', function ($timeout) {
      return {
        restrict: 'EA',
        controller: 'BranchCardCtrl',
        templateUrl: 'directives/branch/branch-card.tpl.html',
        replace: true,
        scope: {
          branchCard: '='
        },
        link: function ($scope, element) {
          $scope.collapseDescr = true;
          $timeout(function () {
            var el = element.find('.description-text');
            $scope.collapseDescr = el[0].scrollHeight > el.height();
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }, 0);
        }
      };
    }])
    .controller('BranchCardCtrl', ['$scope', function($scope) {
      $scope.b = $scope.branchCard;
    }])
  ;
})();
