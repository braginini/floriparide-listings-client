import config from '../../config.js';

import '../common/services/util.js';
import '../common/services/api.js';
import '../common/services/branches.js';
import '../common/services/rubrics.js';
import '../common/services/cache.js';
import '../common/services/dialogs/dialogs.js';

import '../common/directives/delegate.js';
import '../common/directives/frames.js';
import '../common/directives/ng-load.js';
import '../common/directives/scrollbar.js';
import '../common/directives/rating.js';
import '../common/directives/resizable.js';
import '../common/directives/range-slider.js';
import '../common/directives/branch/branch.js';
import '../common/directives/branch/contact.js';
import '../common/directives/branch/schedule.js';
import '../common/directives/branch-filter/branch-filter.js';
import '../common/directives/dashboard/dashboard.js';
import '../common/directives/gallery/gallery.js';
import '../common/directives/feedback/feedback.js';

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
      'angularMoment',
      'templates-app',
      'templates-common',
      'template/tooltip/tooltip-popup.html',
      'template/tabs/tab.html',
      'template/tabs/tabset.html',
      'template/modal/backdrop.html',
      'template/modal/window.html',
      'services.api',
      'services.branches',
      'directives.resizable',
      'directives.scrollbar',
      'directives.dashboard',
      'directives.feedback',
      'app.search'
    ])

    .constant('angularMomentConfig', {
      //preprocess: 'unix', // optional
      //timezone: 'America/Sao_Paulo' // optional
    })

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

    .run(function (api, $q, $timeout, amMoment) {
      amMoment.changeLocale('pt-br');
      initialDefer = $q.defer();
      api.projectList().then(function (res) {
        if (res && res.items.length) {
          config.project = res.items[0];
          initialDefer.resolve(config);
          $timeout(() => {
            $('#loading-mask').remove();
          }, 300);
        } else {
          initialDefer.reject();
        }
        return res;
      });
    })

    .controller('MainCtrl', function ($scope, $rootScope, $stateParams, $state) {
      $scope.query = $stateParams.q;
      $scope.showDashboard = $state.is('main');
      $scope.showDashboardButton = false;
      $scope.$on('search.query', function (event, query) {
        $scope.query = query;
      });

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'main') {
          $scope.showDashboard = true;
          $scope.showDashboardButton = false;
        } else {
          $scope.showDashboard = false;
          $scope.showDashboardButton = false;
        }
      });

      $scope.$on('dashboard.close', function () {
        $scope.showDashboard = false;
        $scope.showDashboardButton = true;
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

      $scope.maxbounds = [];
      $scope.initPoint = config.project.default_position;

      $scope.search = function (q) {
        $state.go('main.search', {query: q});
      };

      $scope.goHome = function () {
        $state.go('main');
        $scope.showDashboard = true;
        $scope.showDashboardButton = false;
      };
    })
;
