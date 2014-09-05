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
      'services.global',
      'services.api',
      'services.branches',
      'directives.resizable',
      'app.search'
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|skype):/);
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

    .controller('MainCtrl', ['$scope', '$rootScope', '$injector', 'config', function ($scope, $rootScope, $injector, config) {
      $scope.isLoading = false;

      var loadingFactory = function (value) {
        return function(e, action) {
          if (action === '/branch/search') {
            $scope.isLoading = value;
          }
        };
      };
      $rootScope.$on('api.request_start', loadingFactory(true));
      $rootScope.$on('api.request_success', loadingFactory(false));
      $rootScope.$on('api.request_failed', loadingFactory(false));

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
      $scope.initPoint = config.project.default_position;

      var $state = $injector.get('$state');
      $scope.search = function (q) {
        $state.go('main.search', {query: q});
      };

      $rootScope = $injector.get('$rootScope');
      $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
          if (toState.name !== 'main.search') {
            $scope.query = null;
          }
        });
    }])
  ;
})();
