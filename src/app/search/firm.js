(function () {
  angular
    .module('app.firm', [
      'ui.router',
      'directives.branch'
    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
      $stateProvider.state('main.search.firm', {
        url: '/firm/:firm_id',
        controller: 'FirmCtrl',
        templateUrl: 'search/firm.tpl.html',
        resolve: {
          branch: ['$stateParams', 'globalState', 'api', 'config', function($stateParams, globalState, api, config) {
            if (globalState.branch && globalState.branch.id == $stateParams.firm_id) {
              return globalState.branch;
            }
            return api.branchGet($stateParams.firm_id).then(function (branch) {
              globalState.branch = branch;
              return branch;
            });
          }]
        }
      });
    }])

    .controller('FirmCtrl', ['$scope', '$state', '$stateParams', 'branch', function ($scope, $state, $stateParams, branch) {
      $scope.b = branch;
      $scope.goParent = function () {
        $state.go('main.search', {query: $stateParams.query});
      };

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
