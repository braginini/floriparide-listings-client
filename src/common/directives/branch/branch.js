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
      $scope.getAddress = function () {
        var adr = '', b = $scope.b;
        if (b.address) {
          if (b.address.street) {
            adr = b.address.street;
          }

          if (b.address.street_number) {
            adr += ' ' + b.address.street_number;
          }

          if (b.address.neighborhood) {
            if (adr.length) {
              adr += ',';
            }
            adr += ' ' + b.address.neighborhood;
          }
        }
        return adr;
      };
    }])
  ;
})();
