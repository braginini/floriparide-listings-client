(function() {
  var initialDefer;
  angular
    .module('app', [
      'ui.router',
      'ui.bootstrap.dropdown',
      'ui.bootstrap.tooltip',
      'ui.bootstrap.tabs',
      'leaflet-directive',
      'infinite-scroll',
      'templates-app',
      'templates-common',
      'template/tooltip/tooltip-popup.html',
      'template/tabs/tab.html',
      'template/tabs/tabset.html',
      'app.config',
      'services.api',
      'services.branches',
      'directives.resizable',
      'directives.frames',
      'directives.branch'
    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      var state = function(name, config) {
        if (!config.resolve) {
          config.resolve = {};
        }
        config.resolve.config = function () {
          return initialDefer.promise;
        };
        return $stateProvider.state(name, config);
      };

      state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'main.tpl.html'
      })
      .state('main.search', {
        url: 'search/:query',
        controller: 'SearchCtrl',
        templateUrl: 'branches.tpl.html'
      });
      $urlRouterProvider.otherwise('/');
    }])

    .run(['api', 'config', '$q', function (api, config, $q) {
      initialDefer = $q.defer();
      api.projectList().then(function (res) {
        if (res && res.items.length) {
          config.project = res.items[0];
          initialDefer.resolve(config);
          $('#loading-mask').remove();
        } else {
          initialDefer.reject();
        }
        return res;
      });
    }])

    .controller('MainCtrl', ['$scope', '$injector', 'config', function ($scope, $injector, config) {
      $scope.layers = {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: config.endpoints.tileLayer,
            layerOptions: {
              subdomains: ['a', 'b', 'c']
            }
          }
        }
      };

      $scope.defaults = config.map_defaults || {};

      $scope.maxbounds = $injector.get('leafletBoundsHelpers').createBoundsFromArray(config.project.bounds);
//      $injector.get('$interval')(function () {
      $scope.initPoint = config.project.default_position;
      //});
      //$scope.initPoint = {};

      $state = $injector.get('$state');
      $scope.search = function (q) {
        $state.go('main.search', {query: q});
      };
    }])

    .controller('SearchCtrl', ['$scope', '$injector', '$stateParams', 'BranchesFeed', function ($scope, $injector, $stateParams, BranchesFeed) {
      if (!$stateParams.query) {
        $injector.get('$location').path('/');
        return;
      }
      $scope.$parent.query = $stateParams.query;

      $scope.feed = new BranchesFeed($stateParams.query);
    }])
  ;
})();
