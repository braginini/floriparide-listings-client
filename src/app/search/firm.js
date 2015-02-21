export default angular
  .module('app.firm', [
    'ui.router',
    'services.branches',
    'directives.branch'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
    $stateProvider.state('main.search.firm', {
      url: '/firm/:firm_id',
      resolve: {
        branch: function (config, $stateParams, BranchActions) {
          return BranchActions.select($stateParams.firm_id);
        }
      },
      views: {
        child_frame: {
          controller: 'FirmCtrl',
          templateUrl: 'search/firm.tpl.html'
        }
      }
    });
  }])

  .controller('FirmCtrl', function ($scope, $state, $stateParams, $timeout, branch) {
    //globalState.branch = branch;
    $scope.b = branch;
    $scope.goParent = function () {
      $state.go('main.search');
    };

    if (!$stateParams.firm_id) {
      $scope.goParent();
      return;
    }

    //$scope.$emit('branchSelect', branch);
    //need it to calculate correct header height in frames directive
    angular.element('.frame-2 .panel-title:first').html($scope.b.name);

    //$scope.$on('$destroy', function () {
    //  globalState.branch = null;
    //  $scope.$emit('branchClose', branch);
    //});

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
  })
;
