(function () {
  var frameSetEl;
  angular
    .module('directives.frames', [
    ])
    .directive('frames', ['$timeout', '$window', function ($timeout, $window) {
      return {
        restrict: 'EC',
        replace: false,
        link: function ($scope, element, attrs) {
          frameSetEl = angular.element(element);
          var el = angular.element(element);
          var winEl = angular.element($window);
          var sync_height = function () {
            var offset = el.offset();
            var winHeight = winEl.height();
            el.height(winHeight - offset.top - 20);
            el.find('.search-result').height(winHeight - offset.top - 60);
          };

          $timeout(sync_height, 0);
          winEl.bind('resize', sync_height);
        }
      };
    }])

    .directive('frame', [function () {
      return {
        restrict: 'EA',
        template: '<div class="frame"></div>',
        replace: true,
        link: function ($scope, element, attrs) {

        }
      };
    }])

    .factory('frames', ['$q', '$http', '$templateCache', '$controller', '$compile',function ($q, $http, $templateCache, $controller, $compile) {
      function getTemplatePromise(options) {
        return options.template ? $q.when(options.template) :
          $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
            return result.data;
          });
      }

      var me = {
        open: function (config) {
          getTemplatePromise(config).then(function (content) {
            var ctrlLocals = {}, domEl;
            var scope = (config.scope || $rootScope).$new();
            if (config.controller) {
              ctrlLocals.$scope = scope;
              $controller(config.controller, ctrlLocals);
            }
            domEl = angular.element('<div class="frame"></div>');
            domEl.html(content);
            $compile(domEl)(scope);
            frameSetEl.append(domEl);
          });
        }
      };
      return me;
    }])
  ;
})();
