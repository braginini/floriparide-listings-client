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
      controller: ['$scope', '$sce', function($scope, $sce) {
        if (_.some(['website', 'facebook', 'twitter', 'instagram', 'draugiem'], v=> v === $scope.c.contact)) {
          $scope.c.url = $sce.trustAsUrl($scope.c.value);
        }

        if ('skype' === $scope.c.contact) {
          $scope.c.url = $sce.trustAsUrl('skype:' + $scope.c.value + '?chat');
        }
      }]
    };
  }])
  .directive('branchContactSn', [function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch/contact-sn.tpl.html',
      replace: true,
      scope: {
        c: '=branchContactSn'
      },
      controller: ['$scope', '$sce', function($scope, $sce) {
        if (_.some(['website', 'facebook', 'twitter', 'instagram', 'draugiem'], v=> v === $scope.c.contact)) {
          $scope.c.url = $sce.trustAsUrl($scope.c.value);
        }
      }]
    };
  }])
  .filter('phone', function (config) {
    return function (phone) {
      if (!phone) {
        return null;
      }

      var numbers = phone.match(/\d+/g, '').join('');
      var code = config.project.phone_codes.find(c=> numbers.startsWith(c));

      var parts = [];
      numbers = numbers.substring(code.length).split('').reverse().join('');
      for (var i = 0; i < numbers.length; i += 3) {
        parts.push(numbers.substring(i, i + 3));
      }
      return '+' + code + ' ' + parts.reverse().join('-');
    };
  })
;
