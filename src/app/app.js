angular
  .module('app', [
    'ui.router',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.tooltip',
    'ui.bootstrap.tabs',
    'leaflet-directive',
    'templates-app',
    'templates-common',
    'template/tooltip/tooltip-popup.html',
    'template/tabs/tab.html',
    'template/tabs/tabset.html',
    'app.config',
    'services.api',
    'directives.resizable'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('main', {
        url: '',
        controller: 'MainCtrl',
        templateUrl: 'main.tpl.html'
      });

    $('#loading-mask').remove();
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

    $scope.maxbounds = $injector.get('leafletBoundsHelpers').createBoundsFromArray(config.maxbounds);
    $injector.get('$interval')(function() {
      $scope.initPoint = config.initPoint;
    });
    $scope.initPoint = {};
  }])
;
