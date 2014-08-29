(function () {
  angular
    .module('directives.branch', [
      'directives.rating'
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
        link: function ($scope, element, attrs) {
          $scope.collapseDescr = true;
          $timeout(function () {
            var el = element.find('.description-text');
            $scope.collapseDescr = el[0].scrollHeight > el.height();
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }, 200);
        }
      };
    }])
    .controller('BranchCardCtrl', ['$scope', function($scope) {
      $scope.b = $scope.branchCard;
    }])
    .filter('formatAddress', function() {
      return function(address) {
        var adr = '';
        if (address) {
          if (address.street) {
            adr = address.street;
          }

          if (address.street_number) {
            adr += ' ' + address.street_number;
          }

          if (address.neighborhood) {
            if (adr.length) {
              adr += ',';
            }
            adr += ' ' + address.neighborhood;
          }
        }
        return adr;
      };
    })
  ;
})();
