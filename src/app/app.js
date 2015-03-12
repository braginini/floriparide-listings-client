import config from '../../config.js';

import '../common/services/util.js';
import '../common/services/api.js';
import '../common/services/branches.js';
import '../common/services/cache.js';
import '../common/services/dialogs/dialogs.js';

import '../common/directives/delegate.js';
import '../common/directives/frames.js';
import '../common/directives/scrollbar.js';
import '../common/directives/rating.js';
import '../common/directives/resizable.js';
import '../common/directives/range-slider.js';
import '../common/directives/branch/branch.js';
import '../common/directives/branch/contact.js';
import '../common/directives/branch/schedule.js';
import '../common/directives/branch-filter/branch-filter.js';

import '../common/extra/BranchClusterGroup.js';

import './search/search.js';
import './search/firm.js';
import './search/filter.js';

var initialDefer;

export var app = angular
    .module('app', [
      'flux',
      'ui.router',
      'ui.bootstrap.buttons',
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
      'services.api',
      'services.branches',
      'directives.resizable',
      'directives.scrollbar',
      'app.search'
    ])

    .config(($stateProvider, $urlRouterProvider, $compileProvider, fluxProvider) => {
        fluxProvider.useCloning(false);

      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|skype):/);
      var state = function (name, config) {
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
    })

    .run(function (api, $q) {
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
    })

    .controller('MainCtrl', function ($scope, $rootScope, $injector, $stateParams) {
      $scope.query = $stateParams.q;
      $scope.$on('search.query', function (event, query) {
        $scope.query = query;
      });

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

      $scope.maxbounds = [];//$injector.get('leafletBoundsHelpers').createBoundsFromArray(config.project.bounds);
      $scope.initPoint = config.project.default_position;

      var $state = $injector.get('$state');
      $scope.search = function (q) {
        $state.go('main.search', {query: q});
      };
    })
;
