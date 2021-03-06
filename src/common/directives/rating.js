export default angular
  .module('directives.rating', [])
  .directive('rating', [function () {
    return {
      restrict: 'EA',
      controller: 'RatingCtrl',
      template: '<input type="number" class="rating" ng-model="rate">',
      replace: true,
      scope: {
        rate: '='
      },
      link: function ($scope, element, attrs) {
        var el = angular.element(element);
        $scope.rate = parseFloat($scope.rate);
        if (isNaN($scope.rate) || $scope.rate === 0) {
          $scope.rate = null;
        }
        el.val($scope.rate);
        el.rating({
          min: 0,
          max: 5,
          step: 1,
          size: attrs.size || 'xs',
          symbol: '\ue805',
          glyphicon: false,
          showCaption: false,
          showClear: false
        });
      }
    };
  }])
  .controller('RatingCtrl', ['$scope', function ($scope) {

  }])
;
