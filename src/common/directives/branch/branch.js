(function () {
  angular
    .module('directives.branch', [
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
  ;
})();
