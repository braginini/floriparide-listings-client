import config from '../../config.js';

import '../common/services/util.js';
import '../common/services/api.js';
import '../common/services/locale.js';
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
var availableLangs = {
  'en': 'en_Us',
  'pt': 'pt_Br',
  'ru': 'ru_Ru',
  'de': 'de_De',
  'lv': 'lv_Lv'
};

var localeNames = {
  'en_Us': 'EN',
  'pt_Br': 'PT(BR)',
  'ru_Ru': 'RU',
  'de_De': 'DE',
  'lv_Lv': 'LV'
};

export var app = angular
    .module('app', [
      'seo',
      'flux',
      'ngCookies',
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
      'nemLogging',
      'leaflet-directive',
      'infinite-scroll',
      'angularMoment',
      'templates-app',
      'templates-common',
      //'uib/template/tooltip/tooltip-popup.html',
      //'uib/template/tabs/tab.html',
      //'uib/template/tabs/tabset.html',
      'uib/template/modal/backdrop.html',
      'uib/template/modal/window.html',
      'services.api',
      'services.locale',
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
      defaultLocale: 'en-US',
      sharedDictionary: 'common',
      fileExtension: '.lang.json?dc=' + cacheRandom,
      persistSelection: true,
      cookieName: 'COOKIE_LOCALE_LANG',
      observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
      delimiter: '::'
    })

    .value('localeSupported', [
      'en-US',
      'pt-BR',
      'ru-RU',
      'de-DE',
      'lv-LV'
    ])

    .value('localeFallbacks', {
      'en': 'en-US',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'de': 'de-DE',
      'lv': 'lv-LV'
    })

    .value('config', config)

    .config(($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider, fluxProvider) => {
      //fluxProvider.useCloning(false);
      fluxProvider.autoInjectStores(true);
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

      let lang = config.clientLocale.split('_')[0];
      let rootUrl = '/' + lang + '/' + config.project.string_id;
      state('main', {
        url: '/:lang/' + config.project.string_id,
        controller: 'MainCtrl',
        templateUrl: 'main.tpl.html'
      });

      $urlRouterProvider.otherwise(rootUrl);
    })

    .config(function (fluxProvider) {
      fluxProvider.setImmutableDefaults({ immutable: false });
    })

    .config(function($provide, nemSimpleLoggerProvider) {
      return $provide.decorator.apply(null, nemSimpleLoggerProvider.decorator);
    })

    .run(function ($q, $timeout, $log, $state, $rootScope, localeService) {
      initialDefer = $q.defer();
      localeService.setLocale(config.clientLocale).then(function () {
        initialDefer.resolve(config);
        $timeout(() => {
          $('#loading-mask').remove();
        }, 300);
      });
      $log.currentLevel = $log.LEVELS.error;

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        var lang = toParams.lang;
        if (!availableLangs[lang]) {
          event.preventDefault();
          $window.location.href = $state.href($state.current, {lang: config.browserLocale.split('_')[0]});
        } else {
          if (availableLangs[lang] !== config.clientLocale) {
            event.preventDefault();
            localeService.setLocale(availableLangs[lang]).then(() => {
              $state.go(toState.name, toParams);
            });
          }
        }
      });
    })

    .controller('MainCtrl', function ($scope, $rootScope, $stateParams, $state, $window) {
      $scope.project = config.project;
      $scope.query = $stateParams.q;
      $scope.showDashboard = $state.is('main');
      $scope.showDashboardButton = false;
      $scope.$on('search.query', function (event, query) {
        $scope.query = query;
      });

      var locales = _.filter(config.project.supportedLocales, l=> l!==config.clientLocale);
      var langs = _.invert(availableLangs);
      $scope.supportedLangs = _.zipObject(_.map(locales, l=> langs[l]), _.map(locales, l=> localeNames[l]));
      $scope.currentLang = localeNames[config.clientLocale];

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

      $scope.defaults = angular.extend(config.map_defaults || {}, {
        maxZoom: config.project.zoom.max,
        minZoom: config.project.zoom.min
      });

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

      $scope.changeLang = function(l) {
        $window.location.href = $state.href($state.current, {lang: l});
      };
    })
;

(function() {
  var injector = angular.injector(['ng', 'ngCookies']);
  var $http = injector.get('$http');
  var $cookies = injector.get('$cookies');

  var ss = window.sessionStorage;
  var browserLanguage = (navigator.language || navigator.browserLanguage).split('-')[0];
  var browserLocale = availableLangs[browserLanguage] || 'en_Us';

  config.browserLocale = browserLocale;
  config.clientLocale = $cookies.get('locale') || browserLocale;

  if (ss) {
    let project = ss.getItem('project');
    if (project) {
      project = angular.fromJson(project);
      project.supportedLocales = ['ru_Ru', 'en_Us', 'lv_Lv'];
      config.project = project;
      angular.bootstrap(document, ['app']);
    }
  }

  if (!config.project) {
    $http.get(config.endpoints.api + '/project/list?locale=' + config.clientLocale).then(res => {
      if (res && res.data && res.data.result.items.length) {
        config.project = res.data.result.items[0];
        config.project.supportedLocales = ['ru_Ru', 'en_Us', 'lv_Lv'];
        ss.setItem('project', angular.toJson(config.project));
      }
      angular.bootstrap(document, ['app']);
    });
  }
})();
