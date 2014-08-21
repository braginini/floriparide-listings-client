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
    'directives.frames'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('main', {
        url: '',
        controller: 'MainCtrl',
        templateUrl: 'main.tpl.html'
      })
      .state('main.search', {
        url: '/search/:query',
        controller: 'SearchCtrl',
        templateUrl: 'branches.tpl.html'
      });

    $('#loading-mask').remove();
  }])

  .run(['api', 'config', function(api, config) {
    var params = {};
    api.projectList(params).then(function (res) {
      if (res && res.items.length) {
        var project = res.items[0];
        config.project = project;
      }
    });
  }])

  .controller('MainCtrl', ['$scope', '$injector', 'config', function($scope, $injector, config) {
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
    $injector.get('$interval')(function() {
      $scope.initPoint = config.project.default_position;
    });
    $scope.initPoint = {};

    $scope.search = function(q) {
      $injector.get('$location').path('/search/' + q);
    };
  }])

  .controller('SearchCtrl', ['$scope', '$injector', '$stateParams', 'BranchesFeed', function($scope, $injector, $stateParams, BranchesFeed) {
    $scope.feed = new BranchesFeed($stateParams.query);
  }])
;
