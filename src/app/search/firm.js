(function () {
  angular
    .module('app.firm', [
      'ui.router',
      'directives.branch'
    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
      $stateProvider.state('main.search.firm', {
        url: '/firm/:firm_id',
        resolve: {
          branch: ['$stateParams', 'globalState', 'api', 'config', function ($stateParams, globalState, api, config) {
            if (globalState.branch && globalState.branch.id == $stateParams.firm_id) {
              return globalState.branch;
            }
            return api.branchGet($stateParams.firm_id).then(function (branch) {
              globalState.branch = branch;
              return branch;
            });
          }]
        },
        views: {
          child_frame: {
            controller: 'FirmCtrl',
            templateUrl: 'search/firm.tpl.html'
          }
        }
      });
    }])

    .controller('FirmCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'globalState', 'branch',
      function ($scope, $state, $stateParams, $timeout, globalState, branch) {
        globalState.branch = branch;
        $scope.b = branch;
        $scope.goParent = function () {
          $state.go('main.search');
        };

        $scope.$emit('branchSelect', branch);

        //need it to calculate correct header height in frames directive
        angular.element('.frame-2 .panel-title:first').html(branch.name);
        $scope.$on('$destroy', function () {
          globalState.branch = null;
          $scope.$emit('branchClose', branch);
        });

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
