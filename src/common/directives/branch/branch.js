export const DisplayGroupIds = {
  'infra':1,
  'payment': 1
};

export default angular
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
          if (el && el.length) {
            $scope.collapseDescr = el[0].scrollHeight > el.height();
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }
        }, 0);
      }
    };
  }])
  .controller('BranchCardCtrl', ['$scope', function($scope) {
    $scope.b = $scope.branchCard;
    var attrGroups = $scope.b.attribute_groups || [];
    $scope.attrGroups = _(attrGroups).groupBy(g => {
      if (DisplayGroupIds[g.icon]) {
        return g.icon;
      } else {
        return 'tags';
      }
    }).mapValues(items => {
      return _(items).pluck('attributes').flatten().value();
    }).value();
  }])
;
