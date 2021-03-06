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
var cacheRandom = Math.round(Math.random() * 100000);

export var app = angular
    .module('app', [
      'seo',
      'flux',
      'ngLocalize',
      'ngLocalize.Config',
      'ngLocalize.InstalledLanguages',
      'ui.router',
      'ui.bootstrap.buttons',
      'ui.bootstrap.dropdown',
      'ui.bootstrap.tooltip',
      'ui.bootstrap.tabs',
      'angulartics',
      'angulartics.piwik',
      'angulartics.google.analytics',
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
      'app.search',
      'app.search.filter'
    ])

    .constant('angularMomentConfig', {
      //preprocess: 'unix', // optional
      //timezone: 'America/Sao_Paulo' // optional
    })

    .value('localeConf', {
      basePath: 'languages',
      defaultLocale: 'pt-BR',
      sharedDictionary: 'common',
      fileExtension: '.lang.json?dc=' + cacheRandom,
      persistSelection: true,
      cookieName: 'COOKIE_LOCALE_LANG',
      observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
      delimiter: '::'
    })

    .value('localeSupported', [
      'pt-BR'
    ])

    .config(($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider, fluxProvider) => {
      fluxProvider.useCloning(false);
      $locationProvider
        .html5Mode(false)
        .hashPrefix('!');

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

      let rootUrl = '/' + config.project.string_id;
      state('main', {
        url: rootUrl,
        controller: 'MainCtrl',
        templateUrl: 'main.tpl.html'
      });

      $urlRouterProvider.otherwise(rootUrl);
    })

    .run(function (api, $q, $timeout, amMoment, locale) {
      amMoment.changeLocale('pt-br');
      initialDefer = $q.defer();
      locale.setLocale('pt-BR');
      locale.ready('common').then(function () {
        initialDefer.resolve(config);
        $timeout(() => {
          $('#loading-mask').remove();
        }, 300);
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

var injector = angular.injector(['ng']);
var $http = injector.get('$http');
var ss = window.sessionStorage;
if (ss) {
  let project = ss.getItem('project');
  if (project) {
    project = angular.fromJson(project);
    config.project = project;
    angular.bootstrap(document, ['app']);
  }
}

if (!config.project) {
  $http.get(config.endpoints.api + '/project/list').then(res => {
    if (res && res.data && res.data.result.items.length) {
      config.project = res.data.result.items[0];
      ss.setItem('project', angular.toJson(config.project));
    }
    angular.bootstrap(document, ['app']);
  });
}
