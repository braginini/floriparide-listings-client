var branchResolver = function (config, $stateParams, $q, flux, BranchActions, SelectedBranchStore) {
  var d = $q.defer();
  var SelectedBranchStoreEmitter = flux.getStore(SelectedBranchStore);
  var onSelect = function () {
    var b = SelectedBranchStore.getSelected();
    if (b && b.id === parseInt($stateParams.firm_id)) {
      d.resolve(b);
    } else {
      d.reject('Invalid branch. Expected id: ' + $stateParams.firm_id + ', actual: ' + b ? b.id : 'unknown');
    }
    SelectedBranchStoreEmitter.off('*', onSelect);
  };
  SelectedBranchStoreEmitter.on('*', onSelect);
  BranchActions.select($stateParams.firm_id);
  return d.promise;
};

export default angular
  .module('app.search.firm', [
    'ui.router',
    'services.branches',
    'directives.branch'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
    $stateProvider.state('main.search.firm', {
      url: '/firm/:firm_id',
      resolve: {
        branch: branchResolver
      },
      views: {
        child_frame: {
          controller: 'FirmCtrl',
          templateUrl: 'search/firm.tpl.html'
        }
      }
    });

    $stateProvider.state('main.rubric.firm', {
      url: '/firm/:firm_id',
      resolve: {
        branch: branchResolver
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
      $state.go('^');
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
