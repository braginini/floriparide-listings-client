export default angular
  .module('directives.contact', [
    'services.util'
  ])
  .directive('branchContact', [function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch/contact.tpl.html',
      replace: true,
      scope: {
        c: '=branchContact'
      },
      link: function ($scope, element, attrs) {

      },
      controller: ['$scope', '$sce', function($scope, $sce) {
        if (_.contains(['website', 'facebook', 'twitter', 'instagram'], $scope.c.contact)) {
          $scope.c.url = $sce.trustAsResourceUrl($scope.c.value);
        }

        if ('skype' === $scope.c.contact) {
          $scope.c.url = $sce.trustAsResourceUrl('skype:' + $scope.c.value + '?chat');
        }
      }]
    };
  }])
  .filter('phone', [function () {
    return function (phone) {
      if (!phone) {
        return null;
      }
      var numbers = phone.match(/\d+/g, '').join('');
      if (numbers.length < 10) {
        if (numbers.indexOf('48') !== 0) {
          numbers = '48' + numbers;
        }
      }

      var parts = [];
      for (var i = 2; i < numbers.length; i += 4) {
        parts.push(numbers.substring(i, i + 4));
      }
      return '(' + numbers.substring(0,2) + ')' + parts.join('-');
    };
  }])
;
