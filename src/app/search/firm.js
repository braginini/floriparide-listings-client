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

  .config(($stateProvider) => {
    var stateConfig = {
      url: '/firm/:firm_id/:name',
      resolve: {
        branch: branchResolver
      },
      params: {
        name: {
          value: null,
          squash: true
        }
      },
      views: {
        child_frame: {
          controller: 'FirmCtrl',
          templateUrl: 'search/firm.tpl.html'
        }
      }
    };

    $stateProvider.state('main.frames', {
      url: 'firm',
      template: '<div class="frames"><div ui-view="child_frame"></div></div>',
    });
    $stateProvider.state('main.frames.firm', _.assign({}, stateConfig, {
      url: '/:firm_id/:name'
    }));
    $stateProvider.state('main.search.firm', _.clone(stateConfig));
    $stateProvider.state('main.rubric.firm', _.clone(stateConfig));
  })

  .controller('FirmCtrl', function ($scope, $state, $stateParams, $timeout, branch) {
    //globalState.branch = branch;
    $scope.b = branch;
    $scope.goParent = function () {
      if ($scope.isRoot) {
        $state.go('main');
      } else {
        $state.go('^');
      }
    };

    if (!$stateParams.firm_id) {
      $scope.goParent();
      return;
    }

    if (!$stateParams.name) {
      var name = branch.name + ' ';
      if (branch.address.street) {
        name += branch.address.street + ' ';
      }
      if (branch.address.street_number) {
        name += branch.address.street_number;
      }
      name = name
        .trim()
        .replace(/\s+-\s+/, ' ')
        .replace(/\s/g, '-');
      $state.transitionTo($state.current.name, {name: name}, {
        location: true,
        inherit: true,
        notify: false
      });
    }

    $scope.isRoot = $state.$current.parent.self.name === 'main.frames';
    if ($scope.isRoot) {
      $scope.isRight = false;
    }
    $scope.frameClass = $scope.isRoot ? 'frame-1' : 'frame-2';

    //$scope.$emit('branchSelect', branch);
    //need it to calculate correct header height in frames directive
    angular.element($scope.frameClass + ' .panel-title:first').html($scope.b.name);
    $scope.htmlReady();

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
