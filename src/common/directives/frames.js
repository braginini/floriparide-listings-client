export default angular
  .module('directives.frames', [])
  .directive('frames', ['$timeout', '$window', function ($timeout, $window) {
    return {
      restrict: 'EC',
      replace: false,
      link: function ($scope, element) {
        var el = angular.element(element);
        var winEl = angular.element($window);
        var syncLayout = function () {
          var offset = el.offset();
          var winHeight = winEl.height();
          el.height(winHeight - offset.top - 10);

          var activeIdx = -1;
          var frames = el.find('.frame');
          frames.each(function (i, dom) {
            var fEl = angular.element(dom);
            var headEl = fEl.find('.panel-heading:first');
            var bodyEl = fEl.find('.panel-body:first');
            bodyEl.height(winHeight - offset.top - 10 - headEl.outerHeight());
            fEl.height(winHeight - offset.top - 10);

            var idx = dom.getAttribute('data-idx');
            if (idx > activeIdx) {
              activeIdx = idx;
            }
          });

          frames.each(function (i, dom) {
            var f = angular.element(dom);
            var idx = f.attr('data-idx');
            if (idx === activeIdx) {
              f.addClass('active');
            } else {
              f.removeClass('active');
            }
          });
        };

        var collapse = function (e) {
          var frames = el.find('.frame');
          frames.addClass('opacity0');
          // waiting animation finish
          $timeout(function () {
            frames.addClass('hidden');
          }, 300);
          if (e) {
            e.preventDefault();
          }
        };

        var expand = function (e) {
          var frames = el.find('.frame');
          frames.removeClass('hidden');
          $timeout(function () {
            frames.removeClass('opacity0');
            syncLayout();
          }, 20);
          if (e) {
            e.preventDefault();
          }
        };

        syncLayout();
        winEl.on('resize', syncLayout);

        el.on('click', '.pc-collapse', collapse);
        el.on('click', '.pc-expand', expand);
        $scope.$on('frameExpand', expand);

        $scope.$on('frameAdded', syncLayout);
        $scope.$on('frameRemoved', syncLayout);
        $scope.$on('layoutUpdated', syncLayout);

        $scope.$on('$destroy', function () {
          winEl.off('resize', syncLayout);
          el.off('click');
        });
      }
    };
  }])

  .directive('frame', ['$timeout', '$window', function ($timeout, $window) {
    return {
      restrict: 'EAC',
      replace: false,
      link: function ($scope, el, attrs) {
        var idx = -1;
        var classes = el.attr('class').split(/\s+/);
        _.each(classes, function (cl) {
          if (cl.indexOf('frame-') === 0) {
            var m = cl.match(/\d+/);
            if (m) {
              idx = parseInt(m[0]);
            }
          }
        });
        el.attr('data-idx', idx);

        //todo: doing now it to avoid blinking on updating frame content
        var offset = el.parents('.frames').offset();
        var winHeight = angular.element($window).height();
        var headEl = el.find('.panel-heading:first');
        var bodyEl = el.find('.panel-body:first');
        bodyEl.height(winHeight - offset.top - 10 - headEl.outerHeight());
        el.height(winHeight - offset.top - 10);

        $scope.isRight = attrs.frameRight !== undefined;

        $scope.toggleFlow = function () {
          $scope.isRight = !$scope.isRight;
        };

        $scope.$emit('frameAdded');
        $scope.$on('$destroy', function() {
          $scope.$emit('frameRemoved');
          el.off('click');
        });
      }
    };
  }])
;
