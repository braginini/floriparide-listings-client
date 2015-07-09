System.registerModule("src/app/app.js", [], function() {
  "use strict";
  var __moduleName = "src/app/app.js";
  var config = System.get("config.js").default;
  System.get("src/common/services/util.js");
  System.get("src/common/services/api.js");
  System.get("src/common/services/branches.js");
  System.get("src/common/services/rubrics.js");
  System.get("src/common/services/cache.js");
  System.get("src/common/services/dialogs/dialogs.js");
  System.get("src/common/directives/delegate.js");
  System.get("src/common/directives/frames.js");
  System.get("src/common/directives/ng-load.js");
  System.get("src/common/directives/scrollbar.js");
  System.get("src/common/directives/rating.js");
  System.get("src/common/directives/resizable.js");
  System.get("src/common/directives/range-slider.js");
  System.get("src/common/directives/branch/branch.js");
  System.get("src/common/directives/branch/contact.js");
  System.get("src/common/directives/branch/schedule.js");
  System.get("src/common/directives/branch-filter/branch-filter.js");
  System.get("src/common/directives/dashboard/dashboard.js");
  System.get("src/common/directives/gallery/gallery.js");
  System.get("src/common/directives/feedback/feedback.js");
  System.get("src/common/extra/BranchClusterGroup.js");
  System.get("src/app/search/search.js");
  System.get("src/app/search/firm.js");
  System.get("src/app/search/filter.js");
  var initialDefer;
  var app = angular.module('app', ['seo', 'flux', 'ngLocalize', 'ngLocalize.Config', 'ngLocalize.InstalledLanguages', 'ui.router', 'ui.bootstrap.buttons', 'ui.bootstrap.dropdown', 'ui.bootstrap.tooltip', 'ui.bootstrap.tabs', 'leaflet-directive', 'infinite-scroll', 'angularMoment', 'templates-app', 'templates-common', 'template/tooltip/tooltip-popup.html', 'template/tabs/tab.html', 'template/tabs/tabset.html', 'template/modal/backdrop.html', 'template/modal/window.html', 'services.api', 'services.branches', 'directives.resizable', 'directives.scrollbar', 'directives.dashboard', 'directives.feedback', 'app.search', 'app.search.filter']).constant('angularMomentConfig', {}).value('localeConf', {
    basePath: 'languages',
    defaultLocale: 'pt-BR',
    sharedDictionary: 'common',
    fileExtension: '.lang.json',
    persistSelection: true,
    cookieName: 'COOKIE_LOCALE_LANG',
    observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
    delimiter: '::'
  }).value('localeSupported', ['pt-BR']).config((["$stateProvider", "$locationProvider", "$urlRouterProvider", "$compileProvider", "fluxProvider", function($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider, fluxProvider) {
    fluxProvider.useCloning(false);
    $locationProvider.html5Mode(false).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|skype):/);
    var state = function(name, config) {
      if (!config.resolve) {
        config.resolve = {};
      }
      config.resolve.config = function() {
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
  }])).run(["api", "$q", "$timeout", "amMoment", "locale", function(api, $q, $timeout, amMoment, locale) {
    amMoment.changeLocale('pt-br');
    initialDefer = $q.defer();
    api.projectList().then(function(res) {
      if (res && res.items.length) {
        config.project = res.items[0];
      } else {
        initialDefer.reject();
      }
      return res;
    }).then(function() {
      return locale.ready('common');
    }).then(function() {
      initialDefer.resolve(config);
      $timeout((function() {
        $('#loading-mask').remove();
      }), 300);
    });
  }]).controller('MainCtrl', ["$scope", "$rootScope", "$stateParams", "$state", function($scope, $rootScope, $stateParams, $state) {
    $scope.query = $stateParams.q;
    $scope.showDashboard = $state.is('main');
    $scope.showDashboardButton = false;
    $scope.$on('search.query', function(event, query) {
      $scope.query = query;
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'main') {
        $scope.showDashboard = true;
        $scope.showDashboardButton = false;
      } else {
        $scope.showDashboard = false;
        $scope.showDashboardButton = false;
      }
    });
    $scope.$on('dashboard.close', function() {
      $scope.showDashboard = false;
      $scope.showDashboardButton = true;
    });
    $scope.layers = {baselayers: {osm: {
          name: 'OpenStreetMap',
          type: 'xyz',
          url: config.endpoints.tileLayer,
          layerOptions: {subdomains: ['a', 'b', 'c']}
        }}};
    $scope.defaults = config.map_defaults || {};
    $scope.maxbounds = [];
    $scope.initPoint = config.project.default_position;
    $scope.search = function(q) {
      $state.go('main.search', {query: q});
    };
    $scope.goHome = function() {
      $state.go('main');
      $scope.showDashboard = true;
      $scope.showDashboardButton = false;
    };
  }]);
  ;
  return {get app() {
      return app;
    }};
});
//# sourceURL=src/app/app.js
