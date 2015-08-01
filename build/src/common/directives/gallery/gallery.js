System.registerModule("src/common/directives/gallery/gallery.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/gallery/gallery.js";
  var ModalInstanceCtrl = function($scope, $modalInstance, $q, $timeout, $interval, $window, Fullscreen, images, index) {
    var winEl = angular.element($window);
    var dlgEl,
        dlgBodyEl,
        mediaEl,
        spinnerEl,
        imgEl;
    $scope.images = _.map(images, function(item) {
      var d = $q.defer();
      if (_.isString(item)) {
        return {
          src: item,
          deferred: d
        };
      }
      item.deferred = d;
      return item;
    });
    $scope.preloads = [];
    $scope.isLoading = false;
    $scope.collapse = true;
    $scope.preferredHeight = 1;
    $scope.readyUI = false;
    $scope.toggleFullScreen = function() {
      if (Fullscreen.isEnabled()) {
        Fullscreen.cancel();
      } else {
        Fullscreen.enable(dlgBodyEl[0]);
      }
      $scope.show($scope.index);
      syncSize();
    };
    var getMaxImgSize = function() {
      var size;
      if (Fullscreen.isEnabled()) {
        size = [winEl.width(), winEl.height()];
      } else {
        size = [(winEl.width() - 200) * 0.8, (winEl.height() - 100)];
      }
      if (size[0] < 300) {
        size[0] = 300;
      }
      if (size[1] < 300) {
        size[1] = 300;
      }
      return size;
    };
    var spinnerPromise;
    var showSpinner = function() {
      if (spinnerPromise) {
        $timeout.cancel(spinnerPromise);
      }
      spinnerPromise = $timeout(function() {
        spinnerEl.show();
        spinnerPromise = null;
      }, 500);
    };
    var hideSpinner = function() {
      if (spinnerPromise) {
        $timeout.cancel(spinnerPromise);
        spinnerPromise = null;
      }
      spinnerEl.hide();
    };
    var getPrevIndex = function(index) {
      return (index > 0) ? index - 1 : $scope.images.length - 1;
    };
    var getNextIndex = function(index) {
      return (index < $scope.images.length - 1) ? index + 1 : 0;
    };
    $scope.showPrev = function() {
      $scope.show(getPrevIndex($scope.index));
    };
    $scope.showNext = function() {
      $scope.show(getNextIndex($scope.index));
    };
    $scope.show = function(index) {
      $scope.index = index;
      var img = $scope.images[index];
      var p = $scope.preloads[index];
      angular.extend(img, p);
      if ($scope.current && ($scope.current.src !== img.src)) {
        showSpinner();
      }
      $scope.current = img;
      if (dlgBodyEl) {
        imgEl.hide();
        syncSizeNow();
        imgEl[0].src = p.src;
        img.deferred.promise.then(function() {
          imgEl.show();
        });
      }
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
    var syncSizeNow = function() {
      var maxSize = getMaxImgSize();
      var dlgMinWidth = 600;
      var w = $scope.current.width,
          h = $scope.current.height;
      if (!w || !h) {
        return;
      }
      if (maxSize[0] <= 300) {
        dlgMinWidth = 300;
      }
      var diffHeight = h / $scope.preferredHeight;
      if (diffHeight > 0.8 && diffHeight < 1.2) {
        w = w * $scope.preferredHeight / h;
        h = $scope.preferredHeight;
      }
      var dlgRatio = maxSize[0] / maxSize[1];
      var ratio = w / h;
      if (dlgRatio / ratio > 1) {
        h = h < maxSize[1] ? h : maxSize[1];
        w = h * ratio;
      } else {
        w = w < maxSize[0] ? w : maxSize[0];
        h = w / ratio;
      }
      var dlgWidth = w < dlgMinWidth ? dlgMinWidth : w;
      if (dlgWidth - w < 10) {
        w = dlgWidth;
      }
      dlgWidth |= 0;
      w |= 0;
      h |= 0;
      dlgEl.width(dlgWidth);
      if (Fullscreen.isEnabled()) {
        mediaEl.width(maxSize[0]);
        mediaEl.height(maxSize[1]);
      } else {
        mediaEl.width(dlgWidth);
        mediaEl.height(h);
      }
      imgEl.width(w);
      imgEl.height(h);
      var wrapper = imgEl.parent();
      if (Fullscreen.isEnabled()) {
        wrapper.height(winEl.height());
      } else {
        wrapper.height(h);
      }
    };
    var syncSize = _.debounce(syncSizeNow, 300);
    var onImgLoad = function() {
      if (!$scope.current.width || Math.abs($scope.current.width - imgEl[0].naturalWidth) > 2) {
        $scope.current.width = imgEl[0].naturalWidth;
      }
      if (!$scope.current.height || Math.abs($scope.current.height - imgEl[0].naturalHeight) > 2) {
        $scope.current.height = imgEl[0].naturalHeight;
      }
      hideSpinner();
      syncSize();
      $scope.current.deferred.resolve();
    };
    $scope.onImgLoad = onImgLoad;
    $scope.onImgLoadError = onImgLoad;
    $scope.onPreloadImgLoad = function(index, event) {
      var img = $scope.images[index],
          el = event.target;
      img.width = el.naturalWidth;
      img.height = el.naturalHeight;
      img.deferred.resolve();
    };
    var removeFullscreenHandler = Fullscreen.$on('FBFullscreen.change', function(evt, isFullscreenEnabled) {
      if (!isFullscreenEnabled) {
        dlgBodyEl.removeClass('fullscreen');
      } else {
        dlgBodyEl.addClass('fullscreen');
      }
    });
    var buildPreloads = function() {
      var i,
          heights = {},
          mostFreqHeight,
          max = 0;
      $scope.preloads = [];
      $scope.preferredHeight = 0;
      for (i = 0; i < $scope.images.length; i++) {
        var img = $scope.images[i];
        $scope.preloads.push(img);
        if (img.height) {
          if (!heights[img.height]) {
            heights[img.height] = 1;
          } else {
            heights[img.height]++;
          }
          if (heights[img.height] > max) {
            max = heights[img.height];
            mostFreqHeight = img.height;
          }
        }
      }
      $scope.preferredHeight = mostFreqHeight;
    };
    var initPromise = $interval(function() {
      dlgEl = angular.element('.modal-dialog');
      if (dlgEl[0]) {
        $interval.cancel(initPromise);
        dlgBodyEl = dlgEl.find('.modal-body');
        mediaEl = dlgBodyEl.find('.modal-media');
        spinnerEl = dlgBodyEl.find('.spinner-wrapper');
        imgEl = dlgBodyEl.find('.media-wrapper img:first');
        $scope.images[index].deferred.promise.then(function() {
          syncSizeNow();
          $scope.readyUI = true;
        });
      }
    }, 10);
    var onResize = function() {
      buildPreloads();
      $scope.show($scope.index);
    };
    winEl.resize(onResize);
    $scope.$on('$destroy', function() {
      removeFullscreenHandler();
      winEl.unbind('resize', onResize);
      dlgEl = null;
      dlgBodyEl = null;
      mediaEl = null;
      spinnerEl = null;
      winEl = null;
    });
    buildPreloads();
    $scope.show(index);
  };
  ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "$q", "$timeout", "$interval", "$window", "Fullscreen", "images", "index"];
  var $__default = angular.module('directives.gallery', ['ui.bootstrap.modal', 'FBAngular', 'directives.ngLoad']).factory('Gallery', ["$modal", function($modal) {
    return {create: function(images) {
        var index = arguments[1] !== (void 0) ? arguments[1] : 0;
        return $modal.open({
          templateUrl: 'directives/gallery/gallery.tpl.html',
          controller: ModalInstanceCtrl,
          windowClass: 'gallery',
          backdrop: true,
          keyboard: true,
          replace: true,
          scope: false,
          transclude: false,
          resolve: {
            index: function() {
              return index;
            },
            images: function() {
              return images;
            }
          }
        });
      }};
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/gallery/gallery.js
